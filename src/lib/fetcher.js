import Cookies from "js-cookie";

const fetcher = async (url, options = {}) => {
  const method = options.method || "get";

  if (method === "get" || method === "GET") {
    Object.keys(options).forEach((key) =>
      url.searchParams.append(key, options[key])
    );
  }

  let headers = {
    Authorization: "Bearer " + Cookies.get("access_token"),
    "Content-Type": "application/json",
  };

  if (options.hasFile) {
    headers = {
      Authorization: "Bearer " + Cookies.get("access_token"),
    };
  }

  const response = await fetch(url, {
    headers: headers,
    ...options,
  });

  //return response.json();
  return response.status === 401 ? response : response.json();
};

export default fetcher;
