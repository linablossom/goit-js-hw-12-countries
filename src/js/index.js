import countriesTpl from "../tpl/countries";
import countriesListTpl from "../tpl/countries-list";
import { fetchCountries } from "./fetchCountries";
import debounce from "lodash.debounce";
import { error, defaultModules } from "@pnotify/core";
import "@pnotify/core/dist/BrightTheme.css";
import * as PNotifyDesktop from "@pnotify/desktop";
defaultModules.set(PNotifyDesktop, {});

const inputEl = document.querySelector("#input");
const countryEl = document.querySelector("#country");

const renderResults = (countries) => {
  if (countries.length > 10) {
    error({
      text: "Too many matches found. Please, enter a more specific query!",
      delay: 3000,
    });
    countryEl.innerHTML = "";
  } else if (countries.length > 1) {
    countryEl.innerHTML = countriesListTpl(countries);
  } else if (countries.length === 1) {
    countryEl.innerHTML = countriesTpl(countries[0]);
  } else {
    countryEl.innerHTML = "";
  }
};

const loadCountries = (str) => {
  if (str === "") {
    countryEl.innerHTML = "";
    return;
  }
  fetchCountries(str)
    .then(renderResults)
    .catch(() => {
      error({
        text: "Cannot load countries!",
        delay: 3000,
      });
      countryEl.innerHTML = "";
    });
};

const onInputChange = debounce((e) => {
  localStorage.setItem("country", e.target.value);
  loadCountries(e.target.value);
}, 500);

const initSearch = () => {
  const searchedStr = localStorage.getItem("country");
  if (!searchedStr) return;
  loadCountries(searchedStr);
  inputEl.value = searchedStr;
};

initSearch();

inputEl.addEventListener("input", onInputChange);
