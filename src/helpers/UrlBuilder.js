class UrlBuilderHelper {
  api(path) {
    return path;
  }

  fileUrl(file) {
    return `http://103.4.145.245/IEIMS/GOVT-TEACHER/${file}`;
  }

  authApi(path) {
    return `http://192.168.68.1/api/v1/${path}`; // alhaj bhai
  }

  cryptowalletApi(path) {
    // return `http://192.168.1.156:8081/${path}`; // alhaj bhai
    return `http://192.168.1.243:8081/${path}`; // sami
  }
}

export const UrlBuilder = new UrlBuilderHelper();
