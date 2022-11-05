<template>
  <div style="padding: 15px 5px 5px 5px">
    <a-button type="primary" size="large" @click="openNotification">Save</a-button>

    <a-space style="margin-left: 5px;">
      <a-select ref="select" v-model:value="value1" :options="allName" size="large" style="width: 190px" @focus="focus"
        @change="handleChange">
        <a-select-option value="null">All</a-select-option>
      </a-select>
    </a-space>
  </div>

  <bryntum-grid ref="grid" v-bind="gridConfig" :data="data" @cellMenuItem="onCellMenuItem" />

  <div class="loading" v-if="!loader"></div>
</template>

<script>
import { ref, reactive } from 'vue';

import {
  BryntumGrid
} from '@bryntum/grid-vue-3';
import { Popup, Toast } from '@bryntum/grid';

import { useGridConfig } from '@/AppConfig';

import { notification } from 'ant-design-vue';

import { getAllNames, getDivisions, getCostcodes, getAccounts } from './services/FinancialService';
import baseURL from "@/libs/axios";
import axios from 'axios';

export default {
  costType: 'App',

  components: {
    BryntumGrid,
  },

  setup() {
    const loader = ref(true);

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const projectId = urlParams.get('project_id');

    const grid = ref(null);
    const gridConfig = reactive(useGridConfig(projectId));
    const data = ref(null);

    const handleChange = async (period_id) => {
      const instance = grid.value.instance.value;

      if (period_id == "select_period") {
        instance.store.data = [];
      } else {
        loader.value = false;

        const res = await axios.get(`${baseURL}&handler=budget_items&dataset=project_items&project_id=` + projectId + "&period_id=" + period_id);
        if (res.data.success == true) {
          instance.store.data = res.data.data;
          loader.value = true;
        }

        // instance.store.readUrl = `${baseURL}&handler=budget_items&dataset=project_items&project_id=` + projectId + "&period_id=" + period_id;
        // instance.store.load();
      }
    };

    const openNotification = () => {
      notification.open({
        message: 'Notification',
        description:
          'Display the notification by click Save button.',
      });
    };

    return {
      loader,
      grid,
      gridConfig,
      data,
      openNotification,
      handleChange,
      value1: ref('Select a Period'),
    };
  },

  data() {
    return {
      allName: [],
      divisions: [],
      costcodes: [],
      accounts: []
    }
  },

  mounted() {
    this.Allnames();
  },

  methods: {
    Allnames() {
      getAllNames().then(res => {
        console.log(res)
        for (var i = 0; i < res.data.length; i++) {
          this.allName[i] = {
            value: res.data[i].id,
            label: res.data[i].name
          }
        }
        this.allName.unshift({ value: "select_period", label: "Select a Period" })
      })

      getDivisions().then(res => {
        this.divisions = res.data

        const division_id = this.divisions[0].id
        getCostcodes(division_id).then(res => {
          this.costcodes = res.data
        })
      })

      getAccounts().then(res => {
        this.accounts = res.data
      })
    },

    onCellMenuItem({ source }) {
      const popup = new Popup({
        title: 'New Budget Item',
        forElement: source.element,
        anchor: true,
        closable: true,
        closeAction: 'destroy',
        width: '20em',
        defaults: {
          labelWidth: '5em'
        },
        items: [
          {
            type: 'combo',
            ref: 'type',
            value: this.divisions[0].name,
            disabled: false,
            items: this.divisions.map(d => d.name),
            onChange: ({ value }) => {
              const division = this.divisions.filter(d => d.name == value)
              getCostcodes(division[0].id).then(res => {
                this.costcodes = res.data
                console.log("costcodes changed", this.costcodes)
              })
            }
          },
          {
            type: 'combo',
            ref: 'type',
            value: this.costcodes[0].name,
            disabled: false,
            items: this.costcodes.map(c => c.name),
          },
          {
            type: 'combo',
            ref: 'type',
            value: this.accounts[0].displayName,
            items: this.accounts.map(m => m.displayName)
          },
        ],
        bbar: [
          {
            type: 'button',
            text: 'Add',
            icon: 'b-fa b-fa-plus',
            color: 'b-green',
            flex: 1,
            ref: 'saveButton',
            onClick() {
              if (popup.isValid) {
                // const { text, field, type, customField } = popup.values;
                const { type } = popup.values;

                const newRow = source.store.getById(source.selectedRecord.id);
                newRow.insertChild({ costType: type, costCode: source.selectedRecord.costType, originalEstimate: 0, current_estimate: 0, total_cost: 0, committed_costs: 0, actual_costs: 0, costs_complete: 0, PCost_complete: 0, projected_estimate: 0 }, newRow.children[0])

                Toast.show("Added the Child Row.");

                popup.close();
              }
            }
          }
        ]
      });
    }
  }
};
</script>

<style lang="scss">
@import './App.scss';
@import '@/assets/css/loader.css';
</style>