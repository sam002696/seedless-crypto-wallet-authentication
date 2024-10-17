import { call, put, takeEvery } from "redux-saga/effects";
import { failed, succeed } from "../reducers/apiSlice";
import fetcher from "../lib/fetcher";
import { AuthUser } from "../helpers/AuthUser";
import { setToastAlert } from "../reducers/toastAlertSlice";
import { setErrorMessage } from "../reducers/errorMessageSlice";

export default function* sagas() {
  yield takeEvery(({ payload: { operationId = null } }) => {
    return typeof operationId === "string" && operationId.length > 0;
  }, performApiAction);
}

function* performApiAction(action) {
  const {
    payload: { output = "output", operationId = "", parameters = {} },
  } = action;

  try {
    let response = yield call(() => fetcher(operationId, parameters));

    if (response.status === 401) {
      AuthUser.removeLoginData();
    }

    if (response.message !== null) {
      yield put(
        setToastAlert({
          type: response.status,
          message: response.message,
        })
      );
    }

    yield put(
      succeed({
        response,
        output,
      })
    );

    //let errors =  response.errors;
    if (response.errors !== null) {
      yield put(
        setErrorMessage({
          errors: response.errors,
          type: response.status,
        })
      );
    }
  } catch (error) {
    yield put(
      failed({
        error: error.response
          ? error.response.obj.error
          : {
              message: "Api call failed or check your internet connection",
            },
      })
    );
  }
}
