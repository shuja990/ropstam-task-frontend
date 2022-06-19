import { Route, Routes } from "react-router-dom";
import "./App.css";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProductScreen from "./screens/ProductScreen";
import HomeScreen from "./screens/HomeScreen";
import Header from "./components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import ProductCreateScreen from "./screens/ProductCreateScreen";
import ProductEditScreen from "./screens/ProductEditScreen";
import CategoriesScreen from "./screens/Categories";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/*" element={<HomeScreen />} exact />
        <Route path="/login" element={<LoginScreen />} exact />
        <Route path="/register" element={<RegisterScreen />} exact />
        <Route path="/addcar" element={<ProductCreateScreen />} exact />
        <Route path="/product/:id" element={<ProductScreen />} exact />
        <Route path="/product/edit/:id" element={<ProductEditScreen />} exact />
        <Route path="/search/:keyword" element={<HomeScreen />} exact />
        <Route path="/page/:pageNumber" element={<HomeScreen />} exact />
        <Route path="/admin/categories" element={<CategoriesScreen />} exact />

      </Routes>
    </>
  );
}

export default App;
