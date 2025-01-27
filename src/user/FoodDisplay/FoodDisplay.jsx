import React from 'react';
import './FoodDisplay.css';
import FoodItem from '../FoodItem/FoodItem';
import GeneralLoader from '../../components/GeneralLoader/GeneralLoader';

const FoodDisplay = ({ category,food_list, searchQuery, setSearchQuery, setLoadingFoodList   }) => {
  const isSubcategorySelected = food_list.length > 0; // Check if food items are available

  const filteredFoodList = food_list.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  

  return (
    <div className="food-display" id="food-display">
      {isSubcategorySelected && (
        <div className="food-display-header">
          <input 
            type="text" 
            placeholder="Search for Items..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}  
            className="search-bar"
          />
          <h2 className='items-h2'>Your Choices, Their Hope!</h2>
        </div>
      )}
      
      <div className="food-display-list">
        {filteredFoodList.length > 0 ? (
          filteredFoodList.map((item, index) => (
            <FoodItem
              key={index}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
            />
          ))
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
};

export default FoodDisplay;
