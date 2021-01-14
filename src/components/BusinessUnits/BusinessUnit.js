// import React from 'react';
// import BusinessUnitCardStyle from '../../styles/BusinessUnitCardStyle';
// import EditSVGIcon from '../../assets/icons/edit.svg';
// import { useUserState } from '../../contexts/UserContext';

// export function BusinessUnitCard({ setModal, name, businessUnitId }) {
//   const { businessUnit } = useUserState();

//   const isNotAdmin = businessUnit && typeof businessUnit === 'string' && businessUnit.toLowerCase() !== 'admin';

//   return (
//     <BusinessUnitCardStyle id='businessCardStyle'>
//       <header className='cardHeader'>
//         {!isNotAdmin && (
//           <button
//             type='button'
//             className='edit'
//             onClick={() =>
//               setModal({
//                 showModal: true,
//                 modalType: 'editBusinessUnitName',
//                 modalItemId: businessUnitId,
//               })
//             }
//           >
//             <span className='buttonIcon'>
//               <img src={EditSVGIcon} alt='edit order price' />
//             </span>
//           </button>
//         )}
//       </header>
//       <div className='cardLink'>
//         <div className='cardMain'>
//           <h2 className='businessUnitTitle'>{name}</h2>
//         </div>
//       </div>
//     </BusinessUnitCardStyle>
//   );
// }

// export default BusinessUnitCard;
