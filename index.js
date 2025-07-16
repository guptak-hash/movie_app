
let currentList = [];
    let filteredList = [];
    let container = document.getElementById("movie-container");
    let paginationContainer = document.getElementById("pagination");
    let currentPage = 1;
    const moviesPerPage = 3;

    async function getData() {
        let movie = document.getElementById("movie").value;

        try {
            let res = await fetch(`https://www.omdbapi.com/?s=${movie}&apikey=7d787b7e`);
            let movieList = await res.json();

            if (movieList.Response === "True") {
                currentList = movieList.Search;
                currentPage = 1; // Reset to first page on new search
                applyFiltersAndSort();
            } else {
                container.innerHTML = `
                    <div style="text-align: center;">
                        <p>No results found for "${movie}".</p>
                        <img src="https://media.giphy.com/media/3o7aTskHEUdgCQAXde/giphy.gif" alt="No results found" style="width: 300px;">
                        <p>Try another search term!</p>
                    </div>
                `;
                paginationContainer.innerHTML = ''; // Clear pagination when no results
            }
        } catch (error) {
            console.error(error.message);
            container.innerHTML = `
                <div style="text-align: center;">
                    <p>Error loading results.</p>
                    <img src="https://media.giphy.com/media/l0HU7JI1m1eWfAL60/giphy.gif" alt="Error" style="width: 300px;">
                </div>
            `;
            paginationContainer.innerHTML = ''; // Clear pagination on error
        }
    }

    function appendList(list) {
        container.innerHTML = null;

        if (list.length === 0) {
            container.innerHTML = `
                <div style="text-align: center;">
                    <p>No movies match your filters.</p>
                </div>
            `;
            paginationContainer.innerHTML = ''; // Clear pagination when no filtered results
            return;
        }

        // Calculate pagination
        const totalPages = Math.ceil(list.length / moviesPerPage);
        renderPagination(totalPages);

        // Get movies for current page
        const startIndex = (currentPage - 1) * moviesPerPage;
        const endIndex = Math.min(startIndex + moviesPerPage, list.length);
        const paginatedList = list.slice(startIndex, endIndex);

        // Display movies
        paginatedList.forEach(function (el) {
            let parent = document.createElement("div");
            parent.setAttribute("id", "parent");

            let div = document.createElement("div");
            let div1 = document.createElement("div");
            let div2 = document.createElement('div');
            let div3 = document.createElement('div')

            let img = document.createElement("img");
            img.src = el.Poster;

            let title = document.createElement("p");
            let year = document.createElement('p');
            let type = document.createElement('p')
            title.innerText = `Name: ${el.Title}`;
            year.innerText = `Year: ${el.Year}`;
            type.innerText = `Type: ${el.Type}`
            div1.append(img);
            div.append(title);
            div2.append(year);
            div3.append(type)
            parent.append(div1, div, div2, div3);
            container.append(parent);
        });
    }

    function renderPagination(totalPages) {
        paginationContainer.innerHTML = '';

        if (totalPages <= 1) return; // Don't show pagination if only one page

        // Previous button
        const prevBtn = document.createElement('button');
        prevBtn.className = `page-btn ${currentPage === 1 ? 'disabled' : ''}`;
        prevBtn.textContent = '«';
        prevBtn.onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                appendList(filteredList);
            }
        };
        paginationContainer.appendChild(prevBtn);

        // Page numbers
        const maxVisiblePages = 5; // Maximum number of visible page buttons
        let startPage, endPage;

        if (totalPages <= maxVisiblePages) {
            startPage = 1;
            endPage = totalPages;
        } else {
            const maxPagesBeforeCurrent = Math.floor(maxVisiblePages / 2);
            const maxPagesAfterCurrent = Math.ceil(maxVisiblePages / 2) - 1;

            if (currentPage <= maxPagesBeforeCurrent) {
                startPage = 1;
                endPage = maxVisiblePages;
            } else if (currentPage + maxPagesAfterCurrent >= totalPages) {
                startPage = totalPages - maxVisiblePages + 1;
                endPage = totalPages;
            } else {
                startPage = currentPage - maxPagesBeforeCurrent;
                endPage = currentPage + maxPagesAfterCurrent;
            }
        }

        // First page and ellipsis if needed
        if (startPage > 1) {
            const firstPageBtn = createPageBtn(1);
            paginationContainer.appendChild(firstPageBtn);

            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.style.padding = '8px 12px';
                paginationContainer.appendChild(ellipsis);
            }
        }

        // Middle pages
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = createPageBtn(i);
            if (i === currentPage) {
                pageBtn.classList.add('active');
            }
            paginationContainer.appendChild(pageBtn);
        }

        // Last page and ellipsis if needed
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.style.padding = '8px 12px';
                paginationContainer.appendChild(ellipsis);
            }

            const lastPageBtn = createPageBtn(totalPages);
            paginationContainer.appendChild(lastPageBtn);
        }

        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.className = `page-btn ${currentPage === totalPages ? 'disabled' : ''}`;
        nextBtn.textContent = '»';
        nextBtn.onclick = () => {
            if (currentPage < totalPages) {
                currentPage++;
                appendList(filteredList);
            }
        };
        paginationContainer.appendChild(nextBtn);
    }

    function createPageBtn(pageNumber) {
        const pageBtn = document.createElement('button');
        pageBtn.className = 'page-btn';
        pageBtn.textContent = pageNumber;
        pageBtn.onclick = () => {
            currentPage = pageNumber;
            appendList(filteredList);
        };
        return pageBtn;
    }

    function applyFiltersAndSort() {
        const sortType = document.getElementById("sort").value;
        const filterType = document.getElementById('type').value;
        
        filteredList = [...currentList];
        
        // Apply filter first
        if (filterType) {
            filteredList = filteredList.filter(item => item.Type === filterType);
        }
        
        // Then apply sort
        if (sortType === 'asc') {
            filteredList.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
        } else if (sortType === 'dsc') {
            filteredList.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
        }
        
        appendList(filteredList);
    }

    function handleSort() {
        currentPage = 1; // Reset to first page when sorting changes
        applyFiltersAndSort();
    }

    function handleTypeFilter() {
        currentPage = 1; // Reset to first page when filter changes
        applyFiltersAndSort();
    }