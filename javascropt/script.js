const searchBox = document.querySelector(".searchBox");
const searchBtn = document.querySelector(".searchBtn");
const recipeContainer = document.querySelector(".recipe-con");
const recipeDetailsContent = document.querySelector(".recipe-details-content");
const recipeCloseBtn = document.querySelector(".recipe-close-btn");

const fetchRecipes = async (query) => {
    recipeContainer.innerHTML = "<h2>Fetching Recipe...</h2>";

    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const response = await data.json();

    recipeContainer.innerHTML = "";
    
    if (response.meals === null) {
        recipeContainer.innerHTML = "<h2>No recipes found.</h2>";
        return;
    }

    response.meals.forEach(meal => {
        const recipeDiv = document.createElement('div');
        recipeDiv.classList.add('recipe');
        recipeDiv.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h3>${meal.strMeal}</h3>
            <p><span>${meal.strArea}</span> Dish</p>
            <p>Belongs to <span>${meal.strCategory}</span> Category</p>
        `;
        
        const button = document.createElement('button');
        button.textContent = 'View Recipe';
        recipeDiv.appendChild(button);

        button.addEventListener('click', () => {
            openRecipePopup(meal);
        });

        recipeContainer.appendChild(recipeDiv);
    });
}

const openRecipePopup = (meal) => {
    recipeDetailsContent.innerHTML = `
        <h2 class= "recipeName">${meal.strMeal}</h2>
        <h3>Ingredients</h3>
        <ul class="IngredientList">${fetchIngredients(meal)}</ul>
        <div class="instruction">
        <h3>Instruction:</h3>
        <p>${meal.strInstructions}</p>
    </div>
       
    `
  
    document.querySelector(".recipe-details").style.display = "block";
}

recipeCloseBtn.addEventListener('click', () => {
    document.querySelector(".recipe-details").style.display = "none";
});

const fetchIngredients = (meal) => {
    let ingredientsList = '';
    for (let i = 1; i <= 20; i++) { // Fixed loop to start from 1
        const ingredient = meal[`strIngredient${i}`];
        if (ingredient) {
            const measure = meal[`strMeasure${i}`];
            ingredientsList += `<li>${measure} ${ingredient}</li>`;
        } else {
            break;
        }
    }
    return ingredientsList;
}

searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    if (searchInput) {
        fetchRecipes(searchInput);
    }
});
