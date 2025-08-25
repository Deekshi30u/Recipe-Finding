import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/", async (req, res) => {
    try {
        const meal = req.body.rcpName;
        if (!meal) {
            return res.render("index.ejs");
        }
        else{
        const response = await axios.get(
            `https://api.spoonacular.com/recipes/complexSearch?query=${meal}&apiKey=74f2a078a0a146dfa9572d80928334df`
        );
        const result = response.data;

        res.render("select.ejs", { data: result });
    }
    } catch (error) {
        console.error("Failed:", error.message);
        res.render("index.ejs", { error: error.message });
    }
});

app.get("/recipes/:id", async (req, res) => {
    const recipeId = req.params.id;
    try {
        const response = await axios.get(
            `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=74f2a078a0a146dfa9572d80928334df`
        );
        const recipeDetails = response.data;
        res.render("details.ejs", { recipe: recipeDetails });
    } catch (error) {
        console.error("Error fetching recipe details:", error.message);
        res.send("Failed to fetch recipe details. Please try again later.");
    }
});


app.listen(port, () => {
    console.log(`Server is successfully running at ${port}`);
});
