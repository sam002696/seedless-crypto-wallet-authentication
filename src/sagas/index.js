import { call, put, takeEvery, all } from "redux-saga/effects";
import { failed, succeed } from "../reducers/apiSlice";
import fetcher from "../lib/fetcher";
import { AuthUser } from "../helpers/AuthUser";
import { setToastAlert } from "../reducers/toastAlertSlice";
import { setErrorMessage } from "../reducers/errorMessageSlice";
import {
  loadNetworkFailure,
  loadNetworkSuccess,
} from "../reducers/networkSlice";
import networkFetcher from "../lib/networkFetcher";

export default function* sagas() {
  yield all([
    takeEvery(({ payload: { operationId = null } }) => {
      return typeof operationId === "string" && operationId.length > 0;
    }, performApiAction),
    takeEvery("network/loadNetwork", handleLoadNetwork),
  ]);
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

function* handleLoadNetwork(action) {
  const { rpcUrl, ticker } = action.payload;

  console.log("rpcUrl", rpcUrl);
  try {
    const accountData = yield call(networkFetcher, "getAccountInfo", {
      rpcUrl,
    });
    const networkData = yield call(networkFetcher, "getNetworkInfo", {
      rpcUrl,
      ticker,
    });

    yield put(loadNetworkSuccess({ ...accountData, ...networkData }));
  } catch (error) {
    yield put(
      loadNetworkFailure({ error: error.message || "Failed to load network" })
    );
  }
}
