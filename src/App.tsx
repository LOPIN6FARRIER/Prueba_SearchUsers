import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { ListOfUsers } from './components/ListOfUsers'
import { SortBy, type User } from './types.d'

function App() {
  const [res, setres] = useState<User[]>([])
  const [colorShow, setcolorShow] = useState(false)
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const originalUsers=useRef<User[]>([])
  const [filterCountry,setFilterCountry]=useState<string | null>(null)
  const [loading,setLoading]  = useState(false)
  const [error,setError]=useState(false)
  const [currentPage,setCurrentPage]=useState(1)
  //guardo el array original para poder resetearlo
  //se comparte entre renderizados
  //no se renderiza al cambiar su valor

  const toggleColors=()=>{
    setcolorShow(!colorShow)
  }

  const toggleCountry=()=>{
    const newSorting=
    sorting===SortBy.NONE
    ?SortBy.COUNTRY
    :SortBy.NONE
    setSorting(newSorting)
  }
  const handleReset=()=>{
  setres(originalUsers.current)
  }

  const handleChangeSort=(sort:SortBy)=>{
    setSorting(sort)
  }

  useEffect(()=>{
    setLoading(true)
    setError(false)
    fetch(`https://randomuser.me/api?results=10&seed=vinicio&&page=${currentPage}`)
    .then(async res=> await res.json())
    .then(res=>{
      setres(res.results)
      originalUsers.current=res.results
    }
    )
    .catch(err=>
      {
        setError(err)
      })
    .finally(()=>{
      setLoading(false)
  })
  },[currentPage])

  // nos modifica el array original asi que al modificarlo 1 ves luego ya no se puede  
  //const sortUsersByCountry = sortByCountry 
  // ?  res.sort((a , b)=>{
  //   return a.location.country.localeCompare(b.location.country)
  //   })
  // : res

  // esta es un 5.5
  //const sortUsersByCountry = sortByCountry 
  // ?  [...res].sort((a , b)=>{
  //   return a.location.country.localeCompare(b.location.country)
  //   })
  // : res

  // gasta muchos recursos al hacer un clone muy profundo
  //const sortUsersByCountry = sortByCountry 
  // ?  structuredClone(res).sort((a , b)=>{
  //   return a.location.country.localeCompare(b.location.country)
  //   })
  // : res

  const filteredUsers = useMemo(()=>{
  return filterCountry !=null && filterCountry.length>0
  ?res.filter(user=>{
    return user.location.country.toLowerCase().includes(filterCountry.toLowerCase())}
  )
  :res
},[res,filterCountry])

  //no esta en todos los nav hasta la fecah actualmente creo que ya 
  const sortedusers = useMemo(()=>{

    if(sorting===SortBy.NONE){
      return filteredUsers
    }

    // if(sorting===SortBy.COUNTRY){
    //   return filteredUsers.toSorted((a , b)=>{
    //     return a.location.country.localeCompare(b.location.country)
    //     })
    // }

    // if(sorting===SortBy.NAME){
    //   return filteredUsers.toSorted((a , b)=>{
    //     return a.name.first.localeCompare(b.name.first)
    //     })
    // }

    // if(sorting===SortBy.LAST){
    //   return filteredUsers.toSorted((a , b)=>{
    //     return a.name.last.localeCompare(b.name.last)
    //     })
    // }

    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const compareProperties: Record<string, (user: User) => any> = {
      [SortBy.COUNTRY]: user => user.location.country,
      [SortBy.NAME]: user => user.name.first,
      [SortBy.LAST]: user => user.name.last
    }

    return filteredUsers.toSorted((a, b) => {
      const extractProperty = compareProperties[sorting]
      return extractProperty(a).localeCompare(extractProperty(b))
    })


},[filteredUsers,sorting])

  const handleDelete=(uuid:string)=>{
    setres(prevstate=>prevstate.filter(user=>user.login.uuid!==uuid))
  }


return (
    <div className='App'>
      <h1>prueba tecnica</h1>
      <header>
        <button onClick={toggleColors}>Colorear Filas</button>
        <button onClick={toggleCountry}>
          {
            sorting===SortBy.COUNTRY
            ?'No ordenar por Pais'
            :'Ordenar por Pais'
          }
        </button>
        <button onClick={handleReset}>Reset</button>
        <input type="text" onChange={(e)=>{
          setFilterCountry(e.target.value)
        }} />
      </header>
      <main>
      {loading && <p>Cargando...</p>}
      {!loading && error && <p>Error al cargar los datos</p>}
      {!loading && !error && res.length===0 && <p>No hay usuarios</p>}
      {!loading && !error && res.length>0 && <ListOfUsers changeSorting={handleChangeSort} deleteUser={handleDelete} showcolors={colorShow} users={sortedusers}/>}
      {!loading && !error && <button onClick={()=>setCurrentPage(currentPage+1)}>Cargar Mas</button>}
      </main>
    </div>
  )
}

export default App
