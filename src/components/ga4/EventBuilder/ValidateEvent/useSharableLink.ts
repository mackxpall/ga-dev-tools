import { useContext, useMemo } from "react"
import { EventCtx, UseFirebaseCtx } from ".."
import { MobileIds, UrlParam, WebIds } from "../types"

const useSharableLink = () => {
  const useFirebase = useContext(UseFirebaseCtx)
  const {
    clientIds,
    instanceId,
    api_secret,
    timestamp_micros,
    non_personalized_ads,
    userProperties,
    items,
    parameters,
    eventName,
    type,
  } = useContext(EventCtx)!

  return useMemo(() => {
    const params = new URLSearchParams()

    const addIfTruthy = (p: UrlParam, v: any) => {
      v && params.append(p, v)
    }

    useFirebase !== undefined &&
      params.append(UrlParam.UseFirebase, useFirebase ? "1" : "0")

    non_personalized_ads !== undefined &&
      params.append(
        UrlParam.NonPersonalizedAds,
        non_personalized_ads ? "1" : "0"
      )

    addIfTruthy(
      UrlParam.AppInstanceId,
      (clientIds as MobileIds).app_instance_id
    )

    addIfTruthy(UrlParam.EventType, type)

    addIfTruthy(UrlParam.EventName, eventName)

    addIfTruthy(UrlParam.ClientId, (clientIds as WebIds).client_id)

    addIfTruthy(UrlParam.UserId, clientIds.user_id)

    addIfTruthy(UrlParam.APISecret, api_secret)

    addIfTruthy(UrlParam.MeasurementId, instanceId.measurement_id)

    addIfTruthy(UrlParam.FirebaseAppId, instanceId.firebase_app_id)

    addIfTruthy(UrlParam.TimestampMicros, timestamp_micros)

    addIfTruthy(UrlParam.UserProperties, btoa(JSON.stringify(userProperties)))

    addIfTruthy(UrlParam.Items, items && btoa(JSON.stringify(items)))

    addIfTruthy(
      UrlParam.Parameters,
      parameters.length > 0 && btoa(JSON.stringify(parameters))
    )

    const urlParams = params.toString()
    const { protocol, host, pathname } = window.location
    return `${protocol}//${host}${pathname}?${urlParams}`
  }, [
    type,
    parameters,
    eventName,
    items,
    userProperties,
    useFirebase,
    clientIds,
    instanceId,
    api_secret,
    timestamp_micros,
    non_personalized_ads,
  ])
}

export default useSharableLink
