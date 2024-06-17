import { useHttp } from "../hooks/useHttp";
import Error from "./Error";
import MealItem from "./MealItem";
const configObject = {};
export default function Meals() {
  const { data, isLoading, error } = useHttp(
    "http://localhost:3000/meals",
    configObject,
    []
  );

  if (isLoading) {
    return <p className="center">Fetching meals...</p>;
  }
  if (error) {
    return <Error title="Failed to fetch meals" message={error} />;
  }
  return (
    <ul id="meals">
      {data.map((meal) => (
        <MealItem key={meal.id} meal={meal} />
      ))}
    </ul>
  );
}
