const users = async () => {
    let loader = document.querySelector('.loader');
    
    if (loader) loader.style.display = 'block'; // Loader ko'rinadigan qilib qo'yish

    // 5 soniya kutish
    await new Promise(resolve => setTimeout(resolve, 3000));

    try {
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        console.log('Received data:', data);

        if (loader) {
            // API dan ma'lumotlar kelganidan keyin 10 sekunddan so‘ng loaderni yashirish
            setTimeout(() => {
                loader.style.display = 'none';
            }, 10000);
        }

        if (Array.isArray(data) && data.length > 0) {
            console.log(`Total items: ${data.length}`);
            let cardWrapper = document.querySelector('.card-wrapper');

            const renderProducts = (products) => {
                cardWrapper.innerHTML = ""; // Oldingi kartalarni tozalash
                products.forEach(e => {
                    let card = document.createElement('div');
                    card.classList.add('card');
                    card.innerHTML = `
                        <img src="${e.image}" alt="${e.title}">
                        <h2>${e.title}</h2>
                        <p><strong>Category:</strong> ${e.category}</p>
                        <p><strong>Price:</strong> $${e.price}</p>
                        <p>${e.description}</p>
                    `;
                    cardWrapper.appendChild(card);
                });
            };

            // **Mahsulotlarni dastlabki render qilish**
            renderProducts(data);

            let select = document.querySelector('.select');
            let input = document.querySelector('.input');

            // **Saralash funksiyasi**
            select.addEventListener('change', () => {
                let sortedData = [...data]; // Asl ma'lumotlarni nusxalash
                if (select.value === 'cheap') {
                    sortedData.sort((a, b) => a.price - b.price);
                } else if (select.value === 'expensive') {
                    sortedData.sort((a, b) => b.price - a.price);
                }
                renderProducts(sortedData);
            });

            // **Qidiruv funksiyasi**
            input.addEventListener('input', () => {
                let filteredData = data.filter(e => 
                    e.title.toLowerCase().includes(input.value.toLowerCase()) || 
                    e.category.toLowerCase().includes(input.value.toLowerCase())
                );
                renderProducts(filteredData);
            });

        } else {
            console.log('No data available');
        }
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        if (loader) loader.style.display = 'none'; // Xatolik bo'lsa ham loaderni yashirish
    }
};

users();
