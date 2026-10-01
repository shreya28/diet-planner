"use client";

import { useEffect, useState } from "react";

type Meal = {
  id: number;
  name: string;
  type: string;
  calories: number;
  protein: number;
};

export default function Home() {
  // Profile
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [goal, setGoal] = useState("Maintain Weight");
  const [activityLevel, setActivityLevel] = useState("Moderate");

  // Profile status
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState("");

  // Meal form
  const [mealName, setMealName] = useState("");
  const [mealType, setMealType] = useState("Breakfast");
  const [mealCalories, setMealCalories] = useState("");
  const [mealProtein, setMealProtein] = useState("");

  // Meals
  const [meals, setMeals] = useState<Meal[]>([]);
  const [mealMessage, setMealMessage] = useState("");

  // Calculations
  const heightNumber = Number(height);
  const weightNumber = Number(weight);
  const ageNumber = Number(age);

  const bmi =
    heightNumber > 0 && weightNumber > 0
      ? weightNumber / Math.pow(heightNumber / 100, 2)
      : 0;

  let calories = 0;

  if (weightNumber > 0 && heightNumber > 0 && ageNumber > 0) {
    const baseCalories =
      10 * weightNumber + 6.25 * heightNumber - 5 * ageNumber + 5;

    const activityMultiplier =
      activityLevel === "Low"
        ? 1.2
        : activityLevel === "Moderate"
          ? 1.55
          : 1.725;

    calories = Math.round(baseCalories * activityMultiplier);

    if (goal === "Lose Weight") {
      calories -= 300;
    }

    if (goal === "Gain Weight") {
      calories += 300;
    }
  }

  const bmiText =
    bmi === 0
      ? "Enter your details"
      : bmi < 18.5
        ? "Below normal range"
        : bmi < 25
          ? "Healthy range"
          : bmi < 30
            ? "Above normal range"
            : "High BMI range";

  // Load meals from database
  useEffect(() => {
    async function loadMeals() {
      try {
        const response = await fetch("/api/meals");

        if (response.ok) {
          const data = await response.json();
          setMeals(data.meals || []);
        }
      } catch (error) {
        console.error(error);
      }
    }

    loadMeals();
  }, []);

  // Save profile
  async function saveProfile() {
    setMessage("");

    if (
      !name ||
      !age ||
      !height ||
      !weight ||
      !goal ||
      !activityLevel
    ) {
      setMessage("Please fill in all the fields.");
      return;
    }

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          age,
          height,
          weight,
          goal,
          activityLevel,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Failed to save profile.");
        return;
      }

      setSaved(true);
      setMessage("Profile saved successfully! 🎉");
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while saving your profile.");
    }
  }

  // Add meal
  async function addMeal() {
    setMealMessage("");

    if (!mealName || !mealCalories || !mealProtein) {
      setMealMessage("Please fill in all meal fields.");
      return;
    }

    try {
      const response = await fetch("/api/meals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: mealName,
          type: mealType,
          calories: mealCalories,
          protein: mealProtein,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMealMessage(data.error || "Failed to add meal.");
        return;
      }

      setMeals((currentMeals) => [...currentMeals, data.meal]);

      setMealName("");
      setMealCalories("");
      setMealProtein("");

      setMealMessage("Meal added successfully! 🍽️");
    } catch (error) {
      console.error(error);
      setMealMessage("Something went wrong while adding the meal.");
    }
  }

  const totalCalories = meals.reduce(
    (total, meal) => total + meal.calories,
    0
  );

  const totalProtein = meals.reduce(
    (total, meal) => total + meal.protein,
    0
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 px-5 py-8 text-gray-800 md:px-10">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <header className="mb-8 flex items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-green-100 text-5xl">
            🥗
          </div>

          <div>
            <h1 className="text-4xl font-extrabold text-green-700 md:text-5xl">
              Diet Planner
            </h1>

            <p className="mt-2 text-lg font-medium text-gray-600">
              Your personalized nutrition dashboard
            </p>
          </div>
        </header>

        {/* WELCOME */}
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-green-500 to-emerald-400 p-7 text-white shadow-lg">
          <p className="text-sm font-semibold">
            WELCOME 👋
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Let&apos;s build your healthy plan!
          </h2>

          <p className="mt-2 text-green-50">
            Track your nutrition, meals and daily goals in one place.
          </p>
        </div>

        {/* PROFILE */}
        <div className="rounded-3xl bg-white p-7 shadow-lg">

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              👤 Your Profile
            </h2>

            <p className="text-sm text-gray-500">
              Enter your information to personalize your plan.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Name
              </label>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Age
              </label>

              <input
                type="number"
                placeholder="Enter your age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Height (cm)
              </label>

              <input
                type="number"
                placeholder="Example: 165"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Weight (kg)
              </label>

              <input
                type="number"
                placeholder="Example: 60"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Fitness Goal
              </label>

              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none focus:border-green-500"
              >
                <option>Maintain Weight</option>
                <option>Lose Weight</option>
                <option>Gain Weight</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Activity Level
              </label>

              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none focus:border-green-500"
              >
                <option>Low</option>
                <option>Moderate</option>
                <option>High</option>
              </select>
            </div>

          </div>

          <button
            onClick={saveProfile}
            className="mt-7 w-full rounded-xl bg-green-600 px-6 py-4 text-lg font-bold text-white hover:bg-green-700"
          >
            💾 Save Profile
          </button>

          {message && (
            <div className="mt-4 rounded-xl bg-green-100 p-4 text-center font-semibold text-green-700">
              {message}
            </div>
          )}
        </div>

        {/* CALCULATIONS */}
        <div className="mt-8 grid gap-5 md:grid-cols-3">

          <div className="rounded-3xl bg-white p-6 shadow-md">
            <p className="text-sm font-bold text-gray-500">
              YOUR BMI
            </p>

            <h2 className="mt-2 text-4xl font-extrabold text-purple-700">
              {bmi > 0 ? bmi.toFixed(1) : "--"}
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              {bmiText}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-md">
            <p className="text-sm font-bold text-gray-500">
              DAILY CALORIE TARGET
            </p>

            <h2 className="mt-2 text-4xl font-extrabold text-orange-600">
              {calories > 0 ? calories : "--"}
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              kcal / day
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-md">
            <p className="text-sm font-bold text-gray-500">
              MEALS LOGGED
            </p>

            <h2 className="mt-2 text-4xl font-extrabold text-green-600">
              {meals.length}
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              {totalCalories} kcal • {totalProtein.toFixed(1)} g protein
            </p>
          </div>

        </div>

        {/* ADD MEAL */}
        <div className="mt-8 rounded-3xl bg-white p-7 shadow-lg">

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              🍽️ Add a Meal
            </h2>

            <p className="text-sm text-gray-500">
              Log what you eat throughout the day.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Meal Name
              </label>

              <input
                type="text"
                placeholder="Example: Oatmeal with Banana"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Meal Type
              </label>

              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none focus:border-green-500"
              >
                <option>Breakfast</option>
                <option>Lunch</option>
                <option>Snack</option>
                <option>Dinner</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Calories
              </label>

              <input
                type="number"
                placeholder="Example: 350"
                value={mealCalories}
                onChange={(e) => setMealCalories(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Protein (g)
              </label>

              <input
                type="number"
                placeholder="Example: 20"
                value={mealProtein}
                onChange={(e) => setMealProtein(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none focus:border-green-500"
              />
            </div>

          </div>

          <button
            onClick={addMeal}
            className="mt-6 w-full rounded-xl bg-orange-500 px-6 py-4 text-lg font-bold text-white hover:bg-orange-600"
          >
            ➕ Add Meal
          </button>

          {mealMessage && (
            <div className="mt-4 rounded-xl bg-green-100 p-4 text-center font-semibold text-green-700">
              {mealMessage}
            </div>
          )}
        </div>

        {/* MEAL LIST */}
        <div className="mt-8 rounded-3xl bg-white p-7 shadow-lg">

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                📋 Today&apos;s Meals
              </h2>

              <p className="text-sm text-gray-500">
                Meals stored in your database
              </p>
            </div>

            <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
              {totalCalories} kcal
            </span>
          </div>

          {meals.length === 0 ? (
            <div className="mt-6 rounded-2xl bg-gray-50 p-8 text-center">
              <p className="text-gray-500">
                No meals added yet.
              </p>

              <p className="mt-1 text-sm text-gray-400">
                Add your first meal above.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">

              {meals.map((meal) => (
                <div
                  key={meal.id}
                  className="flex items-center justify-between rounded-2xl bg-green-50 p-5"
                >
                  <div>
                    <p className="font-bold text-gray-900">
                      {meal.name}
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                      {meal.type} • {meal.protein} g protein
                    </p>
                  </div>

                  <p className="font-bold text-orange-600">
                    {meal.calories} kcal
                  </p>
                </div>
              ))}

            </div>
          )}
        </div>

        {/* FOOTER */}
        <footer className="py-8 text-center">
          <p className="text-sm font-medium text-gray-500">
            🥗 Eat well • Stay hydrated • Stay healthy
          </p>
        </footer>

      </div>
    </main>
  );
}