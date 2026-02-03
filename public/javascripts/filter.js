document.getElementById("arrival").addEventListener("change", (e)=> {
  console.log(this.checked);
  if (e.target.checked) window.location.href = e.target.value
});

document.getElementById("title").addEventListener("change", (e)=> {
  console.log(this.checked);
  if (e.target.checked) window.location.href = e.target.value
});

document.getElementById("rating").addEventListener("change", (e)=> {
  if (e.target.checked) window.location.href = e.target.value
});

document.getElementById("release_year").addEventListener("change", (e)=> {
  if (e.target.checked) window.location.href = e.target.value
});