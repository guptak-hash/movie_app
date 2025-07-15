async function getData() {
  let movie = document.getElementById("movie").value;
  
  try {
    let res = await fetch(`https://www.omdbapi.com/?s=${movie}&apikey=7d787b7e`);
    let movieList = await res.json();

    if (movieList.Response === "True") {
      let actualList = movieList.Search;
      appendList(actualList);
    } else {
   
      container.innerHTML = `
        <div style="text-align: center;">
          <p>No results found for "${movie}".</p>
          <img src="https://media.giphy.com/media/3o7aTskHEUdgCQAXde/giphy.gif" alt="No results found" style="width: 300px;">
          <p>Try another search term!</p>
        </div>
      `;
    }
  } catch (error) {
    console.error(error.message);
    container.innerHTML = `
      <div style="text-align: center;">
        <p>Error loading results.</p>
        <img src="https://media.giphy.com/media/l0HU7JI1m1eWfAL60/giphy.gif" alt="Error" style="width: 300px;">
      </div>
    `;
  }
}

let container = document.getElementById("movie-container");

function appendList(list) {
  container.innerHTML = null;
  
  list.forEach(function (el) {
    let parent = document.createElement("div");
    parent.setAttribute("id", "parent");

    let div = document.createElement("div");
    let div1 = document.createElement("div");
    let div2 = document.createElement('div');
    let div3=document.createElement('div')

    let img = document.createElement("img");
    img.src = el.Poster 

    let title = document.createElement("p");
    let year = document.createElement('p');
    let type=document.createElement('p')
    title.innerText = `Name: ${el.Title}`;
    year.innerText = `Year: ${el.Year}`;
    type.innerText=`Type: ${el.Type}`
    div1.append(img);
    div.append(title);
    div2.append(year);
    div3.append(type)
    parent.append(div1, div, div2, div3);
    container.append(parent);
  });
}