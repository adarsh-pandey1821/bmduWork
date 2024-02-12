// import React, { useState } from 'react'
// import CustomButton from "../Utility/Button";
// import tabClick from "../Utility/TabClick";

// function Bank_receipt() {
//   const [tabList, settabList] = useState([
//     {
//       tabName: "Header",
//       active: false,
//       // render: <Country />,
//     },
//     {
//       tabName: "Accounts",
//       active: true,
//       // render: <State />,
//     },
//     // {
//     //   tabName: "City",
//     //   active: false,
//     //   render: <City />,
//     // },
//   ]);
//   return (
//     <main>
//     <section className="total-order" style={{ minHeight: "75vh" }}>
//                 <ul className="d-flex total-order-tab align-items-center justify-content-end gap-2 dashboard-pills">
//     {tabList.map((item, i) => {
//                     return (
//                       <li key={i}>
//                         <CustomButton
//                           navPills
//                           btnName={item.tabName}
//                           pillActive={item.active ? true : false}
//                           ClickEvent={() => tabClick(i, tabList, settabList)}
//                         />
//                       </li>
//                     );
//                   })}
//                   </ul>
//       </section>
//       </main>
//   )
// }

// export default Bank_receipt