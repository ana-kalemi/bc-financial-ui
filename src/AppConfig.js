import baseURL from "@/libs/axios";
import { GridRowModel } from '@bryntum/grid';

class Gate extends GridRowModel {
  static get fields() {
    return [
      'costCode', 'costCodeDivision',
      { name: 'originalEstimate', type: 'number' },
      { name: 'current_estimate', type: 'number' },
      { name: 'total_cost', type: 'number' },
      { name: 'committed_costs', type: 'number' },
      { name: 'actual_costs', type: 'number' },
      { name: 'costs_complete', type: 'number' },
      { name: 'PCost_complete', type: 'number' },
      { name: 'projected_estimate', type: 'number' },
    ];
  }
}

export const useGridConfig = (project_id) => {
  return {
    features: {
      tree: true,
      treeGroup: {
        levels: ['costCodeDivision', 'costCode'],
      },
      cellMenu: {
        items: {
          removeRow: false,
          extraItem: {
            text: 'Add',
            icon: 'b-fa b-fa-plus',
            weight: 200,
            onItem: () => { }
          }
        }
      }
    },
    columns: [
      {
        type: 'tree',
        text: 'Cost Code',
        field: 'costType',
        flex: 3,
        editor: false
      },
      {
        type: 'aggregate',
        text: 'Original Estimate',
        field: 'originalEstimate',
        flex: 2,
        format: {
          minimumFractionDigits: 2
        },
      },
      {
        type: 'aggregate',
        text: 'Current Estimate',
        field: 'current_estimate',
        flex: 2,
        format: {
          minimumFractionDigits: 2
        },
        editor: false
      },
      {
        type: 'aggregate',
        text: 'Total Cost',
        field: 'total_cost',
        flex: 2,
        format: {
          minimumFractionDigits: 2
        },
        editor: false
      },
      {
        type: 'aggregate',
        text: 'Committed Costs',
        field: 'committed_costs',
        flex: 2,
        format: {
          minimumFractionDigits: 2
        },
        editor: false
      },
      {
        type: 'aggregate',
        text: 'Actual Costs',
        field: 'actual_costs',
        flex: 2,
        format: {
          minimumFractionDigits: 2
        },
        editor: false
      },
      {
        type: 'aggregate',
        text: 'Costs to Complete',
        field: 'costs_complete',
        flex: 2,
        format: {
          minimumFractionDigits: 2
        },
        editor: false
      },
      {
        type: 'aggregate',
        text: 'Proj. Cost Complete',
        field: 'PCost_complete',
        flex: 2,
        format: {
          minimumFractionDigits: 2
        },
        editor: false
      },
      {
        type: 'aggregate',
        text: 'Projected Estimate',
        field: 'projected_estimate',
        flex: 2,
        format: {
          minimumFractionDigits: 2
        },
        editor: false
      }
    ],
    store: {
      modelClass: Gate,
      readUrl: `${baseURL}&handler=budget_items&dataset=project_items&project_id=` + project_id,
      // readUrl: "",
      autoLoad: true,
    },
  };
};