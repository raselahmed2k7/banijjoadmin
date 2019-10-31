import React from 'react';
console.log('localstorage in route',localStorage);
console.log('localstorage in route',localStorage.user_status);
const Breadcrumbs = React.lazy(() => import('./views/Base/Breadcrumbs'));
const Cards = React.lazy(() => import('./views/Base/Cards'));
const Carousels = React.lazy(() => import('./views/Base/Carousels'));
const Collapses = React.lazy(() => import('./views/Base/Collapses'));
const Dropdowns = React.lazy(() => import('./views/Base/Dropdowns'));
const Forms = React.lazy(() => import('./views/Base/Forms'));
const Jumbotrons = React.lazy(() => import('./views/Base/Jumbotrons'));
const ListGroups = React.lazy(() => import('./views/Base/ListGroups'));
const Navbars = React.lazy(() => import('./views/Base/Navbars'));
const Navs = React.lazy(() => import('./views/Base/Navs'));
const Paginations = React.lazy(() => import('./views/Base/Paginations'));
const Popovers = React.lazy(() => import('./views/Base/Popovers'));
const ProgressBar = React.lazy(() => import('./views/Base/ProgressBar'));
const Switches = React.lazy(() => import('./views/Base/Switches'));
const Tables = React.lazy(() => import('./views/Base/Tables'));
const Tabs = React.lazy(() => import('./views/Base/Tabs'));
const Tooltips = React.lazy(() => import('./views/Base/Tooltips'));
const BrandButtons = React.lazy(() => import('./views/Buttons/BrandButtons'));
const ButtonDropdowns = React.lazy(() => import('./views/Buttons/ButtonDropdowns'));
const ButtonGroups = React.lazy(() => import('./views/Buttons/ButtonGroups'));
const Buttons = React.lazy(() => import('./views/Buttons/Buttons'));
const Charts = React.lazy(() => import('./views/Charts'));
const Dashboard = React.lazy(() => import('./views/Dashboard'));
const CoreUIIcons = React.lazy(() => import('./views/Icons/CoreUIIcons'));
const Flags = React.lazy(() => import('./views/Icons/Flags'));
const FontAwesome = React.lazy(() => import('./views/Icons/FontAwesome'));
const SimpleLineIcons = React.lazy(() => import('./views/Icons/SimpleLineIcons'));
const Alerts = React.lazy(() => import('./views/Notifications/Alerts'));
const Badges = React.lazy(() => import('./views/Notifications/Badges'));
const Modals = React.lazy(() => import('./views/Notifications/Modals'));
const CategoryOrder = React.lazy(() => import('./views/category_order/CategoryOrder'));

const Colors = React.lazy(() => import('./views/Theme/Colors'));
const Products = React.lazy(() => import('./views/product/Products'));
const SoldProductsList = React.lazy(() => import('./views/product/SoldProductsList'));
const Categories = React.lazy(() => import('./views/product/Categories'));
const Vendor = React.lazy(() => import('./views/product/Vendor'));
const ProductSpecifications = React.lazy(() => import('./views/product/ProductSpecifications'));
const ProductSpecificationDetails = React.lazy(() => import('./views/product/ProductSpecificationDetails'));

// DISCOUNTS INFORMATION IMPORT
const Discounts = React.lazy(() => import('./views/product/Discount'));
const ProductDiscounts = React.lazy(() => import('./views/product/ProductDiscount'));

// CUTOMER INFORMAION IMPORT
const CustomerList = React.lazy(() => import('./views/customer/CustomerList'));
const OrderList = React.lazy(() => import('./views/customer/OrderList'));
const Purchase = React.lazy(() => import('./views/Purchase/Purchase'));
const PurchaseReturn = React.lazy(() => import('./views/PurchaseReturn/PurchaseReturn'));

// SALES INFORMATION IMPORT
const SalesReturn = React.lazy(() => import('./views/SalesReturn/SalesReturn'));

// FEATURE INFORMATION IMPORT
const FeatureName = React.lazy(() => import('./views/FeatureName/FeatureName'));
const Feature = React.lazy(() => import('./views/Feature/Feature'));
const Typography = React.lazy(() => import('./views/Theme/Typography'));
const Widgets = React.lazy(() => import('./views/Widgets/Widgets'));
const Users = React.lazy(() => import('./views/Users/Users'));
const User = React.lazy(() => import('./views/Users/User'));
const FeturedCategory = React.lazy(() => import('./views/feturedCategory'));
const TermsAndCondition = React.lazy(() => import('./views/TermsAndCondition/TermsAndCondition'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/terms-condition/add-terms-condition', name: 'Terms & Condition', component: TermsAndCondition },

  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/theme', exact: true, name: 'Theme', component: Colors },
  { path: '/category/fetured-categories', name: 'Featured Category', component: FeturedCategory },

  { path: '/theme/colors', name: 'Colors', component: Colors },
  { path: '/product/products', name: 'Products', component: Products },
  { path: '/product/sold-products-list', name: 'SoldProductsList', component: SoldProductsList },
  { path: '/product/categories', name: 'Categories', component: Categories },
  { path: '/product/vendor', name: 'Vendor', component: Vendor },
  { path: '/product/products-specifications', name: 'ProductSpecifications', component: ProductSpecifications },
  { path: '/product/products-specification-details', name: 'ProductSpecificationDetails', component: ProductSpecificationDetails },
  { path: '/product/navbar-categories', name: 'Navbar Category Order', component: CategoryOrder },

  // DISCOUNTS ROUTE PATH
  { path: '/product/discount-list', name: 'Discounts', component: Discounts },
  { path: '/product/product-discount-list', name: 'ProductDiscounts', component: ProductDiscounts },

  // CUSTOMER ROUTE PATH
  { path: '/customer/customer-List', name: 'CustomerList', component: CustomerList },
  { path: '/customer/order-List', name: 'OrderList', component: OrderList },

  // PURCHASE ROUTE PATH
  { path: '/purchase/purchase', name: 'Purchase', component: Purchase },
  { path: '/purchase/purchase-return', name: 'Purchase', component: PurchaseReturn },

  // SALES ROUTE PATH 
  { path: '/sales/sales-return', name: 'Sales', component: SalesReturn },

  // FEATURE ROUTE PATH 
  { path: '/feature/feature', name: 'Feature Products', component: Feature },
  { path: '/feature/feature_name', name: 'Feature Name', component: FeatureName },

  { path: '/theme/typography', name: 'Typography', component: Typography },
  { path: '/base', exact: true, name: 'Base', component: Cards },
  { path: '/base/cards', name: 'Cards', component: Cards },
  { path: '/base/forms', name: 'Forms', component: Forms },
  { path: '/base/switches', name: 'Switches', component: Switches },
  { path: '/base/tables', name: 'Tables', component: Tables },
  { path: '/base/tabs', name: 'Tabs', component: Tabs },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', component: Breadcrumbs },
  { path: '/base/carousels', name: 'Carousel', component: Carousels },
  { path: '/base/collapses', name: 'Collapse', component: Collapses },
  { path: '/base/dropdowns', name: 'Dropdowns', component: Dropdowns },
  { path: '/base/jumbotrons', name: 'Jumbotrons', component: Jumbotrons },
  { path: '/base/list-groups', name: 'List Groups', component: ListGroups },
  { path: '/base/navbars', name: 'Navbars', component: Navbars },
  { path: '/base/navs', name: 'Navs', component: Navs },
  { path: '/base/paginations', name: 'Paginations', component: Paginations },
  { path: '/base/popovers', name: 'Popovers', component: Popovers },
  { path: '/base/progress-bar', name: 'Progress Bar', component: ProgressBar },
  { path: '/base/tooltips', name: 'Tooltips', component: Tooltips },
  { path: '/buttons', exact: true, name: 'Buttons', component: Buttons },
  { path: '/buttons/buttons', name: 'Buttons', component: Buttons },
  { path: '/buttons/button-dropdowns', name: 'Button Dropdowns', component: ButtonDropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', component: ButtonGroups },
  { path: '/buttons/brand-buttons', name: 'Brand Buttons', component: BrandButtons },
  { path: '/icons', exact: true, name: 'Icons', component: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', component: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', component: Flags },
  { path: '/icons/font-awesome', name: 'Font Awesome', component: FontAwesome },
  { path: '/icons/simple-line-icons', name: 'Simple Line Icons', component: SimpleLineIcons },
  { path: '/notifications', exact: true, name: 'Notifications', component: Alerts },
  { path: '/notifications/alerts', name: 'Alerts', component: Alerts },
  { path: '/notifications/badges', name: 'Badges', component: Badges },
  { path: '/notifications/modals', name: 'Modals', component: Modals },
  { path: '/widgets', name: 'Widgets', component: Widgets },
  { path: '/charts', name: 'Charts', component: Charts },
  { path: '/users', exact: true,  name: 'Users', component: Users },
  { path: '/users/:id', exact: true, name: 'User Details', component: User },
];

export default routes;
