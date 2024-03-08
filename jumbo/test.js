import jumboUrls from "./newLinks.json" assert { type: "json" };
import axios from "axios";

const fetchItem = async (url) => {
  const res = await axios(jumboUrls[0]);
  console.log(res);
};
fetchItem(jumboUrls[0]);
