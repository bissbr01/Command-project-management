import { useFormikContext } from 'formik'
import { isEqual, debounce } from 'lodash'
import { useCallback, useEffect, useState } from 'react'

export function useFormikSubmit() {
  const formik = useFormikContext()
  const [lastValues, updateState] = useState(formik.values)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const submitForm = useCallback(
    debounce(
      (): void => {
        formik.submitForm()
      },
      500,
      { maxWait: 1500 }
    ),
    []
  )

  useEffect(() => {
    const valuesEqualLastValues = isEqual(lastValues, formik.values)
    const valuesEqualInitialValues = isEqual(
      formik.values,
      formik.initialValues
    )

    if (!valuesEqualLastValues) {
      updateState(formik.values)
    }

    if (!valuesEqualLastValues && !valuesEqualInitialValues && formik.isValid) {
      submitForm()
    }
  }, [
    formik.values,
    formik.isValid,
    lastValues,
    formik.initialValues,
    submitForm,
  ])

  return { formik }
}
