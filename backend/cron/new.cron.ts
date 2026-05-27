import cron from "node-cron"
import countryModel from "../models/country.model"
import deliveryPostCodePrifixModel from "../models/deliveryPostCodePrifix.model"
import deliveryZonePriceModel from "../models/deliveryZonePrice.model"
import markuppersentageModel from "../models/markuppersentage.model"
import zonModel from "../models/zon.model"
import { faker } from "@faker-js/faker/."

export const startcorn = ()=>{
    console.log("zone cron started")

    cron.schedule("*/5 * * * * * ",async ()=>{
        try {
            const country = await countryModel.findOne()
            const postcode = await deliveryPostCodePrifixModel.findOne()
            const zonePrice = await deliveryZonePriceModel.findOne()
            const markup = await markuppersentageModel.findOne()

            if(!country || !postcode || !zonePrice || !markup){
                console.log("Required relation data missing")
                return
            }
            const newZone = await zonModel.create({
                zoneName:faker.location.city() + "Zone",
                zoneCode:`ZONE-${faker.string.alphanumeric(6)}`,
                countryId:country._id,
                postcodePrefixId:postcode._id,
                markupId:markup._id,

                waterValue:faker.number.int({
                    min:10,
                    max:100
                }),

                markupValue:faker.number.int({
                    min:5,
                    max:50
                }),

                increasePercentage:faker.number.int({
                    min:1,
                    max:20
                }),

                description:faker.lorem.sentence(),
                status:true
            })

            console.log("Zone created",newZone.zoneName)
        } catch (error:any) {
            console.log("startcron error",error)
        }
    })

// Delete zones older than 1 minute every 4 seconds
    cron.schedule("*/4 * * * * *", async () => {
        try {
          const timeLimit = new Date(Date.now() - 60 * 1000);
    
          const result = await zonModel.deleteMany({createdAt: { $lt: timeLimit },});
    
          console.log(" Deleted zones:",result.deletedCount);
        } catch (error: any) {
          console.log("Cron Delete Error:",error.message);
        }
      });
}

