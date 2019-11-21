import { mount, createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import oa from 'src/store/oa/index';
import SystemConfig from 'src/modules/oa/packages/system_config/index.vue';
import Attendance from 'src/modules/oa/packages/system_config/components/Attendance.vue';
import Special from 'src/modules/oa/packages/system_config/components/Special.vue';
import axios from 'axios';
import {
  Row,
  Col,
  Button,
  Select,
  Option,
  Tabs,
  TabPane,
  Input,
  Card,
  Notification,
  Container,
  Aside,
  Main,
  Menu,
  MenuItem,
  MenuItemGroup,
  Submenu,
  Loading,
  Table,
  TableColumn,
  Pagination,
  Dialog,
  Form,
  FormItem,
  Radio,
  RadioButton,
  RadioGroup,
  DatePicker,
  TimeSelect,
  Tree,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Slider,
  OptionGroup,
  Collapse,
  CollapseItem,
  Popover
} from "element-ui";


const localVue = createLocalVue()

localVue.use(Vuex)
localVue.use(Row);
localVue.use(Col);
localVue.use(Button);
localVue.use(Select);
localVue.use(Option);
localVue.use(Tabs);
localVue.use(TabPane);
localVue.use(Input);
localVue.use(Card);
localVue.use(Container);
localVue.use(Aside);
localVue.use(Main);
localVue.use(Menu);
localVue.use(MenuItemGroup);
localVue.use(MenuItem);
localVue.use(Submenu);
localVue.use(Loading);
localVue.use(Table);
localVue.use(TableColumn);
localVue.use(Pagination);
localVue.use(Dialog);
localVue.use(Form);
localVue.use(FormItem);
localVue.use(Radio);
localVue.use(RadioGroup);
localVue.use(DatePicker);
localVue.use(TimeSelect);
localVue.use(Tree);
localVue.use(RadioButton);
localVue.use(Dropdown);
localVue.use(DropdownMenu);
localVue.use(DropdownItem);
localVue.use(Slider);
localVue.use(OptionGroup);
localVue.use(Collapse);
localVue.use(CollapseItem);
localVue.use(Popover);

describe('SystemConfig', () => {

  const modules = { oa }
  for (let module in modules) {
    modules[module].namespaced = true
  }

  const Http = axios.create({
    baseURL: process.env.VUE_APP_CLIENT_REQUEST
  })
  Http.interceptors.request.use(function (config) {
    if (config.data) {
      config.data = Object.keys(config.data).map(key => {
        return `${key}=${config.data[key]}`
      }).join('&')
    }
    return config;
  }, function (error) {
    console.log(error)
    return Promise.reject(error);
  })

  modules["http"] = {
    state: {
      post: Http.post,
      get: Http.get
    }
  }
  modules["notify"] = {
    state: {
      success: Notification.success,
      error: Notification.error,
    }
  }

  const store = new Vuex.Store({
    modules
  }) as any
  store.state["oa"].SystemConfig.components = {
    Attendance, Special
  }
  store.state["oa"].SystemConfig['Attendance'] = Attendance["storeState"]
  store.state["oa"].SystemConfig['Special'] = Special["storeState"]

  it('SystemConfig', async () => {
    const wrapper = shallowMount(Attendance, {
      localVue,
      store
    })
    // wrapper.findAll(".item").at(0).trigger('click')
    await new Promise(resolve => {
      setTimeout(function () {
        resolve()
      }, 1500)
    })
    console.log(
      wrapper.vm.$store.state["oa"].SystemConfig.Attendance
    )
    // expect(wrapper.text()).toMatch(msg)
    // expect(wrapper.text()).toMatchSnapshot()
  })

})
