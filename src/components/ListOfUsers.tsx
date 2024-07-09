import {SortBy, type User} from '../types.d'
interface Props{
    changeSorting:(sort:SortBy)=>void,
    deleteUser:(uuid:string)=>void,
    users:User[],
    showcolors:boolean
}
export function ListOfUsers({changeSorting,deleteUser,users,showcolors}:Props){
    return(
        <table width='100%'>
            <thead>
                <tr>
                    <th>Foto</th>
                    <th className='pointer' onClick={()=>changeSorting(SortBy.NAME)}>Nombre</th>
                    <th className='pointer' onClick={()=>changeSorting(SortBy.LAST)}>Apellido</th>
                    <th className='pointer' onClick={()=>changeSorting(SortBy.COUNTRY)}>Pais</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {
                    users.map((user,index)=>{
                        const backGroundColor=index%2===0?'#333':'#555'
                        const color=showcolors?backGroundColor:'transparent'
                        return(
                            <tr style={{backgroundColor:color}} key={user.login.uuid}>
                                <td><img src={user.picture.thumbnail} alt=""/></td>
                                <td>{user.name.first}</td>
                                <td>{user.name.last}</td>
                                <td>{user.location.country}</td>
                                <td>
                                    <button onClick={()=>deleteUser(user.login.uuid)}>Eliminar</button>
                                </td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    )
}