import Cookies from "js-cookie";

class AuthUserHelper {
  getUser() {
    const user = JSON.parse(localStorage?.getItem("auth_user") || "{}");
    return user || {};
  }

  getUserId() {
    const user = JSON.parse(localStorage?.getItem("auth_user") || "{}");
    return user?.id || null;
  }

  getUserName() {
    const user = JSON.parse(localStorage?.getItem("auth_user") || "{}");
    return user.username || null;
  }

  getUserFullName() {
    const user = JSON.parse(localStorage?.getItem("auth_user") || "{}");
    // const { firstname, username } = user;

    // return firstname || username || null;
    // return `${user.firstName}` || `${user.username}` || null;
    return `${user.firstName ? user.firstName : user.username}` || null;
  }

  getInstituteId() {
    const institute = JSON.parse(localStorage?.getItem("institute_id"));
    return parseInt(institute?.instituteId) || 1;
  }
  getBranchId() {
    const branch = JSON.parse(localStorage?.getItem("institute_id"));
    return parseInt(branch?.branchId) || 1;
  }
  getBranchName() {
    const institute = JSON.parse(localStorage.getItem("institute_id"));
    return institute?.branchName || null;
  }
  getUserEmployeeId() {
    const institute = JSON.parse(localStorage.getItem("institute_id"));
    return parseInt(institute?.employeeId) || 1;
  }

  getInstituteName() {
    const institute = JSON.parse(localStorage.getItem("institute_id"));
    return institute?.instituteName || null;
  }
  getInstituteEIIN() {
    const institute = JSON.parse(localStorage.getItem("institute_id"));
    return institute?.eiinNo || null;
  }

  // getUserInstitute() {
  //   const instituteResponse = JSON.parse(
  //     localStorage.getItem("auth_user_institute")
  //   );
  //   return instituteResponse.instituteName || "";
  // }

  getRoles() {
    const roles = localStorage?.getItem("auth_roles")
      ? JSON.parse(localStorage?.getItem("auth_roles"))
      : [];
    return roles || [];
  }

  getRolesID() {
    const rolesID = localStorage.getItem("auth_rolesID")
      ? JSON.parse(localStorage.getItem("auth_rolesID"))
      : [];
    return rolesID || [];
  }
  isLooggedIn() {
    return Cookies?.get("access_token")?.length > 0;
  }

  saveLoginData(authData) {
    // save token
    let token = authData.accessToken || "";
    Cookies.set("access_token", token, { expires: 15 });

    // save user
    localStorage.setItem("auth_user", JSON.stringify(authData?.user));

    // save institute id
    if (authData.instituteResponse !== undefined) {
      localStorage.setItem(
        "institute_id",
        JSON.stringify(authData?.instituteResponse)
      );
    }

    // save user roles
    let roles = [];
    authData?.roles?.forEach((item) => {
      roles.push(item.roleName);
    });
    localStorage.setItem("auth_roles", JSON.stringify(roles));
  }

  savePublicKey(publicKey) {
    localStorage.setItem("publicKey", JSON.stringify(publicKey));
  }

  savePrivateKey(privateKey) {
    localStorage.setItem("privateKey", JSON.stringify(privateKey));
  }

  saveChallengeMessage(challenegeMessage) {
    localStorage.setItem(
      "challenegeMessage",
      JSON.stringify(challenegeMessage)
    );
  }

  getPublicKey() {
    const publicKey =
      localStorage.getItem("publicKey") &&
      JSON.parse(localStorage.getItem("publicKey"));

    return publicKey;
  }
  getPrivateKey() {
    const privateKey =
      localStorage.getItem("privateKey") &&
      JSON.parse(localStorage.getItem("privateKey"));

    return privateKey;
  }

  getChallengeMessage() {
    const challenegeMessage =
      localStorage.getItem("challenegeMessage") &&
      JSON.parse(localStorage.getItem("challenegeMessage"));

    return challenegeMessage;
  }

  removeLoginData() {
    Cookies.set("access_token", "");
    localStorage.setItem("publicKey", "");
    localStorage.setItem("privateKey", "");
    localStorage.setItem("challenegeMessage", "");
    // localStorage.setItem("auth_user_institute", "");
  }
}

export const AuthUser = new AuthUserHelper();
