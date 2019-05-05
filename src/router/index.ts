import Vue from 'vue'
import Router from 'vue-router'
import FundraiserView from '../components/FundraiserView.vue';
import ItemView from '../components/ItemView.vue';
import { RouterOptions, RouteConfig } from 'vue-router';
import SellView from "@/components/SellView.vue";
import PayView from "@/components/PayView.vue";
import PayDetailView from "@/components/PayDetailView.vue";

Vue.use(Router);
const navRoutes = <Array<RouteConfig>>[
    { name: 'Fundraiser', path: '/Fundraiser', component: FundraiserView },
    { name: 'Item', path: '/Item', component: ItemView},
    { name: 'Sell', path: '/Sell', component: SellView},
    { name: "Pay", path: '/Pay', component: PayView}
];
const routerOptions = <RouterOptions>{
    routes: navRoutes
};
export default new Router(routerOptions)





