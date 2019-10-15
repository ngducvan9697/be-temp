import mongoose from "mongoose";
const { Schema } = mongoose;

let urlTopicCrawlSchema = new Schema({
  name: String,
  hrefs: [
    {
      url: String,
      isCraw: Boolean
    }
  ],
  totalUrl: Number
});

// Export the model
export default mongoose.model("UrlTopicCrawl", urlTopicCrawlSchema);
