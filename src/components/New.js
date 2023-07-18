import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function New() {
  const navigate = useNavigate();

  const [recipeInput, setRecipeInput] = useState({
    name: "",
    ingredients: [],
    steps: [],
    image: "",
  });

  const [ingredientInput, setIngredientInput] = useState(""); // New state for individual ingredient input
  const [stepInput, setStepInput] = useState(""); // New state for individual step input

  const handleChange = (e) => {
    const value = e.target.value;
    setRecipeInput({
      ...recipeInput,
      [e.target.name]: value,
    });
  };

  //Adding each individual ingredient
  const handleIngredientChange = (e) => {
    setIngredientInput(e.target.value);
  };

  //Adding each individual step
  const handleStepChange = (e) => {
    setStepInput(e.target.value);
  };

  const handleAddIngredient = () => {
    if (ingredientInput) {
      setRecipeInput({
        ...recipeInput,
        ingredients: [...recipeInput.ingredients, ingredientInput], // Add new ingredient to the array
      });
      setIngredientInput(""); // Clear the ingredient input field
    }
  };

  const handleAddStep = () => {
    if (stepInput) {
      setRecipeInput((prevRecipeInput) => {
        const updatedSteps = [...prevRecipeInput.steps, `${stepInput}`];
        console.log(recipeInput.steps)
        return {
          ...prevRecipeInput,
          steps: updatedSteps, // Add numbered step to the array + Add new step to the array
        };
      });
      setStepInput("")
    }
  };
  
  const handleDeleteIngredient = (index) => {
    const updatedIngredients = [...recipeInput.ingredients];
    updatedIngredients.splice(index, 1);
    setRecipeInput({
      ...recipeInput,
      ingredients: updatedIngredients,
    });
  };

  const handleDeleteStep = (index) => {
    const updatedSteps = [...recipeInput.steps];
    updatedSteps.splice(index, 1);

    setRecipeInput({
      ...recipeInput,
      steps: updatedSteps,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (recipeInput.steps.length === 0 || recipeInput.ingredients.length === 0) {
      return(
        console.log('enter atleast 1 step and ingredient')
      )
    } 
    else {
      const URL = `${process.env.REACT_APP_BACKEND_URI}/recipes`;
      console.log("recipe input", recipeInput);
      const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipeInput),
      });
      const data = await response.json();
      console.log("response", data);
      navigate("/");
    }
    
  };

  return (
    <Form onSubmit={handleSubmit} className="input">
      <h1>Create a Recipe</h1>
      <Form.Group className="mb-3" >
        <Form.Label>Enter recipe name</Form.Label>
        <Form.Control placeholder="recipe name" />
      </Form.Group>

      <div>
        <ul>
        {/* Displaying existing ingredients */}
        {recipeInput.ingredients.map((ingredient, index) => (
          <div key={index}>
            <li>{ingredient}</li>
            <Button variant="danger" onClick={() => handleDeleteIngredient(index)}> Delete Ingredient </Button>
          </div>
        ))}
        </ul>
      </div>

      {/* <input onChange={handleIngredientChange} value={ingredientInput} placeholder="Enter an ingredient" /> */}
      <Form.Group className="mb-3" >
        <Form.Label>Enter ingredients</Form.Label>
        <Form.Control placeholder="Enter ingredient" onChange={handleIngredientChange}/>
      </Form.Group>
      <Button variant="success" onClick={handleAddIngredient}> Add Ingredient </Button>

    <div>
        {/* Displaying existing steps */}
        <ol>
          {recipeInput.steps.map((step, index) => (
            <div key={index}>
              <li>{step}</li>
              <Button variant="danger" onClick={() => handleDeleteStep(index)}> Delete Step </Button>
            </div>
          ))}
        </ol>
    </div>

    <Form.Group className="mb-3" >
      <Form.Label>Enter recipe steps</Form.Label>
      <Form.Control placeholder="Enter step" onChange={handleStepChange}/>
    </Form.Group>
    <Button variant="success" onClick={handleAddStep}> Add Step </Button>

    {/* <div>
      <input onChange={handleChange} value={recipeInput.image} name="image" placeholder="Image" />
    </div> */}
    <Form.Group className="mb-3" >
      <Form.Label>Enter recipe image</Form.Label>
      <Form.Control placeholder="Enter image link" onChange={handleChange} value={recipeInput.image}/>
    </Form.Group>
      
    <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

export default New;
