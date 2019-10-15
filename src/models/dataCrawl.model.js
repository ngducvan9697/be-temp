import mongoose from "mongoose";
const { Schema } = mongoose;

let dataCrawlSchema = new Schema({
  knowledge: String,
  href: String,
  shortDefinition: String,
  quote: String,
  practiceExample: String,
  textExplain: String,
  topic: [
    {
      name: String,
      prevalence: { type: Number, default: 0 }
    }
  ],
  detailDefinition: [
    {
      wordType: String,
      definition: String,
      examples: [String],
      instances: [
        {
          name: String,
          words: [
            {
              word: String,
              href: String
            }
          ],
          definition: String
        }
      ]
    }
  ]
});

// Export the model
export default mongoose.model("DataCrawl", dataCrawlSchema);
