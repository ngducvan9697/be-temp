// ==================================== IMPORT LIBRARY ======================================
import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import HttpStatus from "http-status-codes";
import { setGlobalMiddleware } from "./middlewares/global-middleware";
import puppeteer from "puppeteer";
import cheerio from "cheerio";
import proxyChain from "proxy-chain";

import { mainConfig } from "./config/main.config";
import { mainRouter } from "./routes/main.router";
// mongoose
mongoose.Promise = global.Promise;
mongoose.connect(mainConfig.urlDb, { useNewUrlParser: true });
mongoose.set("useCreateIndex", true);
const app = express();
const port = mainConfig.port;

// register global middleware
setGlobalMiddleware(app);
app.use("/api", mainRouter);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.message = "Invalid route";
  error.status = HttpStatus.NOT_FOUND;
  next(error);
});
app.use((err, req, res, next) => {
  return res.status(err.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
    error: {
      message: err.message
    }
  });
});

import DataCrawl from "./models/dataCrawl.model";
let browser;
let count = 0;
let topics = [
  // "toeic",
  // "ielts",
  // "phrase verbs",
  // "idioms",
  // "conversation",
  // "daily words"
];
// let topics = ["asda", "aaaaaaaaaaaaaaaaaaaaaaaaa"];
const url = "https://www.vocabulary.com/lists/search?query=";
async function scarpeUrlListTopic(url, topic) {
  let urlsTopic = [];
  let countStop = 0;
  try {
    const page = await browser.newPage();
    await page.goto(`${url}${topic}`);
    console.log(`${url}${topic}`);
    try {
      while (countStop <= 200) {
        await page.waitForSelector("button.loadmore", { timeout: 3000 });
        await page.click("button.loadmore");
        countStop++;
        console.log("12", countStop);
      }
    } catch (error) {
      console.log("het roi!");
    } finally {
      console.log("do something");
      const html = await page.evaluate(() => document.body.innerHTML);
      const $ = await cheerio.load(html);
      urlsTopic = $("a.readMore")
        .map((i, x) => $(x).attr("href"))
        .toArray();
    }
    await page.close();
  } catch (error) {
    console.log(error);
  } finally {
  }

  return urlsTopic;
}

async function scarpeUrlListWord(url, page, topic, count) {
  let wordsOfTopic = [];
  try {
    await page.goto(url, { waitUntil: "networkidle2" });
    count++;
    const html = await page.evaluate(() => document.body.innerHTML);
    const $ = await cheerio.load(html);
    await $("li.entry").map((i, x) => {
      let word = $(x)
        .find("a.word")
        .text();
      let href = $(x)
        .find("a.word")
        .attr("href");
      let shortDefinition = $(x)
        .find("div.definition")
        .text();
      let dataCrawl = new DataCrawl({
        knowledge: word,
        href: href,
        shortDefinition: shortDefinition
      });
      wordsOfTopic.push(dataCrawl);
    });

    const detailPage = await browser.newPage();
    for (var i = 0; i < wordsOfTopic.length; i++) {
      await scarpeDetailtWord(
        `https://www.vocabulary.com${wordsOfTopic[i].href}`,
        wordsOfTopic[i],
        detailPage,
        topic,
        count
      );
    }
    if (count > 650) {
      console.log("het 2");
      return;
    }
    await detailPage.close();
    return;
  } catch (error) {
    console.log(error);
  } finally {
  }
}

async function scarpeDetailtWord(url, word, page, topic) {
  try {
    const data = await DataCrawl.findOne({ knowledge: word.knowledge });

    if (
      data &&
      data.topic.find(x => {
        return x.name === topic;
      })
    ) {
      await DataCrawl.updateOne(
        { _id: data._id },
        { $inc: { "topic.$[element].prevalence": 1 } },
        { arrayFilters: [{ "element.name": { $eq: topic } }], upsert: true }
      );
      return;
    }
    if (data) {
      await DataCrawl.updateOne(
        { _id: data._id },
        {
          $addToSet: { topic: { name: topic } }
        }
      );
      return;
    }
    count++;
    if (count > 650) {
      console.log("het 1");
      return;
    }
    console.log(count);

    await page.goto(url, { waitUntil: "networkidle2" });
    const html = await page.evaluate(() => document.body.innerHTML);
    const $ = await cheerio.load(html);
    word.practiceExample = $("p.short").text();
    word.textExplain = $("p.long").text();
    word.topic.push({ name: topic });

    word.detailDefinition = $("div.ordinal div.sense")
      .map((i, x) => {
        let wordType = $(x)
          .find("h3.definition a.anchor")
          .text();

        $(x)
          .find("h3.definition a.anchor")
          .remove();
        let definition = $(x)
          .find("h3.definition")
          .remove("a.anchor")
          .text()
          .trim();
        let examples = $(x)
          .find("div.defContent div.example")
          .map((i, x) => {
            return $(x)
              .text()
              .replace(/\s\s+/g, " ");
          })
          .toArray();

        let instances = [];
        $(x)
          .find("div.defContent dl.instances")
          .map((i, x) => {
            let name = $(x)
              .find("dt")
              .text();

            let words = $(x)
              .find("a.word")
              .map((i, x) => {
                let href = $(x).attr("href");
                let word = $(x).text();

                return { word: word, href: href };
              })
              .toArray();
            let definition = $(x)
              .find("div.definition")
              .text();
            let instance = {
              name: name,
              words: words,
              definition: definition
            };
            instances.push(instance);
          });

        let detailDefinition = {
          wordType: wordType,
          definition: definition,
          examples: examples,
          instances: instances
        };
        return detailDefinition;
      })
      .toArray();

    await DataCrawl.create(word);
  } catch (error) {
    console.log(error);
  } finally {
  }
}

async function mainScrape() {
  const oldProxyUrl = "http://proxy_user+DE:proxy_password@x.botproxy.net:8080";
  const newProxyUrl = await proxyChain.anonymizeProxy(oldProxyUrl);

  browser = await puppeteer.launch(
    { headless: true },
    { args: [`--proxy-server=${newProxyUrl}`] }
  );
  // const listTopicPage = await browser.newPage();

  for (var j = 0; j < topics.length; j++) {
    count = 0;
    let urlTopics = await scarpeUrlListTopic(url, topics[j]);

    let listWordPage = await browser.newPage();

    for (var i = 0; i < urlTopics.length; i++) {
      count++;
      await scarpeUrlListWord(
        `https://www.vocabulary.com${urlTopics[i]}`,
        listWordPage,
        topics[j],
        count
      );
      if (count > 650) {
        console.log("het 3,");
        break;
      }
    }
    if (count > 650) {
      console.log("het 3,");
      break;
    }
    await listWordPage.close();
  }
  await browser.close();
}
mainScrape();

app.listen(port, () => {
  console.log("Server is up and running on port numner " + port);
});
