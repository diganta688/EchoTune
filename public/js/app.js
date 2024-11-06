const createplaylist = document.getElementById("create-playlist-sidebar");
const createplaylist2 = document.getElementById("create-playlist-sidebar2");
const createplaylistopen = document.getElementById("create-playlist-div");
const createplaylistclose = document.getElementById("x-mark");
const profile = document.querySelector(".profile");
const profiledropdown = document.querySelector(".profile-dropdown");
const closeprofile = document.querySelector("#x-mark2");


profile.addEventListener("click", ()=>{
    profiledropdown.style.display = "inline";
})

createplaylist.addEventListener("click", ()=>{
    createplaylistopen.style.display = "inline"
});

createplaylist2.addEventListener("click", ()=>{
    createplaylistopen.style.display = "inline"
});

createplaylistclose.addEventListener("click", ()=>{
    createplaylistopen.style.display = "none"
    
});

closeprofile.addEventListener("click", ()=>{
    
    profiledropdown.style.display = "none";
})


