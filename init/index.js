const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../Models/listing.js");

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

main().then(()=>{
    console.log("Connect to DB");
}).catch(err=>{
    console.log(err);
});

const initDB=async ()=>{
     await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"6778c785fa2f994936058eb9"}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
};

initDB();