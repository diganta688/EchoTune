const profileAdmin = document.getElementById("profileAdmin");
const cross = document.getElementById("cross");
const profileDropdownAdmin = document.getElementById("profileDropdownAdmin");
const addartist = document.getElementById("addartist");
const addArtistDiv = document.getElementById("addArtistDiv");
const addArtistDivClose = document.getElementById("addArtistDivClose");
const addalbum = document.getElementById("addalbum");
const addAlbumtDiv = document.getElementById("addAlbumtDiv");
const addAlbumtDivClose = document.getElementById("addAlbumtDivClose");


profileAdmin.addEventListener("click", ()=>{
    profileDropdownAdmin.style.display = "inline";
});

cross.addEventListener("click", ()=>{
    profileDropdownAdmin.style.display = "none";

});

addartist.addEventListener("click", ()=>{
    addArtistDiv.style.display = "inline";
});

addArtistDivClose.addEventListener("click", ()=>{
    addArtistDiv.style.display = "none";
    
});

addalbum.addEventListener("click", ()=>{
    addAlbumtDiv.style.display = "inline";
});

addAlbumtDivClose.addEventListener("click", ()=>{
    addAlbumtDiv.style.display = "none";

})