import { useCallback } from "react"
import { useLocation, useNavigate } from "react-router"

interface SearchParamsOperationConfig{
  navigate?:boolean
  defaultSearchParams?:URLSearchParams
}

export const useSearchParams = ()=>{

  const location = useLocation()
  const navigate = useNavigate()

  const setSearchParams = useCallback((
    key:string,
    value:string|string[],
    config:SearchParamsOperationConfig = {navigate: true}
  )=>{
    const searchParams = config.defaultSearchParams ?? new URLSearchParams(location.search)
    
    if(Array.isArray(value)){
      searchParams.delete(key)

      value.forEach(val=>{
        searchParams.append(key,val)
      })
    }else{
      searchParams.set(key,value)
    }

    if(config.navigate) navigate([location.pathname,searchParams.toString()].join("?"))

    return searchParams
  },[location,navigate])

  const deleteSearchParams = useCallback((
    key:string,
    value?:string,
    config:SearchParamsOperationConfig = {navigate:true}
  )=>{
    const searchParams = config.defaultSearchParams ?? new URLSearchParams(location.search)

    searchParams.delete(key,value)

    if(config.navigate) navigate([location.pathname,searchParams.toString()].join("?"))

    return searchParams
  },[location,navigate])

  const searchParamsHas = useCallback((key:string,config:SearchParamsOperationConfig={}):boolean=>{
    const searchParams = config.defaultSearchParams ?? new URLSearchParams(location.search)

    return searchParams.has(key)
  },[location])

  const getSearchParams = useCallback((key:string,config:SearchParamsOperationConfig={}):string|null=>{
    const searchParams = config.defaultSearchParams ?? new URLSearchParams(location.search)

    return searchParams.get(key)
  },[location])

  const getAllSearchParams = useCallback((key:string,config:SearchParamsOperationConfig={}):string[]=>{
    const searchParams = config.defaultSearchParams ?? new URLSearchParams(location.search)

    return searchParams.getAll(key)
  },[location])

  return {
    setSearchParams,
    deleteSearchParams,
    searchParamsHas,
    getSearchParams,
    getAllSearchParams
  }
}