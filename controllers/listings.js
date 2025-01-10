const Listing=require("../Models/listing.js");
// const mbxGeocoding=require('@mapbox/mapbox-sdk/services/geocoding');

module.exports.index=async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!listing){
        req.flash("error","Listing does not exist");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
};

// module.exports.createListing=async (req,res,next)=>{
    

//     function geocode() {
//         var location = document.getElementById('location').value;
//         var url = 'https://nominatim.openstreetmap.org/search?format=json&q=' + location;

//         fetch(url)
//             .then(response => response.json())
//             .then(data => {
//                 if (data && data.length > 0) {
//                     var lat = data[0].lat;
//                     var lon = data[0].lon;

//                     // Displaying a marker on the map
//                     var latLon = new L.LatLng(lat, lon);
//                     map.setView(latLon, 13);
//                     L.marker(latLon).addTo(map)
//                         .bindPopup('Location: ' + location)
//                         .openPopup();
//                 } else {
//                     alert('Location not found!');
//                 }
//             })
//             .catch(error => {
//                 console.error('Error:', error);
//                 alert('Error retrieving location data.');
//             });
//     }

//     let url=req.file.path;
//     let filename=req.file.filename;
//     const newListing=new Listing(req.body.listing);
//     newListing.owner=req.user._id;
//     newListing.image={url,filename};
//     await newListing.save();
//     req.flash("success","New Listing Created");
//     res.redirect("/listings");
// };

module.exports.createListing = async (req, res, next) => {
    // Handle file upload data
    let url = req.file.path;
    let filename = req.file.filename;

    // Create a new listing object with incoming data from the form
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    try {
        // Check if location exists and if so, geocode it
        if (req.body.listing.location) {
            const location = req.body.listing.location;
            const geocodeData = await geocodeLocation(location);

            if (geocodeData) {
                newListing.latitude = geocodeData.lat;
                newListing.longitude = geocodeData.lon;
            } else {
                req.flash('error', 'Location not found.');
                return res.redirect('/listings'); // Early return if geocoding fails
            }
        }

        // Save the listing to the database
        await newListing.save();
        req.flash('success', 'New Listing Created');
        res.redirect('/listings');
    } catch (error) {
        console.error('Error creating listing:', error);
        req.flash('error', 'An error occurred while creating the listing.');
        res.redirect('/listings');
    }
};



// Geocode function to fetch latitude and longitude based on location name
async function geocodeLocation(location) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.length > 0) {
             return { lat: data[0].lat, lon: data[0].lon };
        } else {
            return null; // No result found
        }
    } catch (error) {
        console.error('Error in geocoding:', error);
        return null;
    }
}

module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not exist");
        res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
};

module.exports.updateListing=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !== "undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }

    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing deleted");
    res.redirect("/listings");
};