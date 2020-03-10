import React, { Component } from 'react';
import styled from 'styled-components';
import axios from 'axios';

import { compose } from 'recompose';

import { proxy, apiUrl, queryBakery, defaultChart } from './default';
import { withFirebase } from '../Firebase';
import { fetchDataTitles, fetchData } from './fetch';
import allEmissionData from './allEmissionData';

import TabSettings from './TabSettings';
import PopupMsg from '../PopupMsg';
import Charts from './Charts';
import { withDashboard } from './context';

import DbdGrid from './DndGrid';
import DndGrid from './DndGrid';

/* const Wrapper = styled.div`
  position: relative;
  width: 100%;
  margin-top: 5rem;
`; */

const TabWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const ChartsWrapper = styled.div`
  margin: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

  @media print {
    display: block !important;
  }
`;

const DropdownContainer = styled.div`
  width: 100%;
  margin: auto;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
`;

const TabName = styled.input`
  height: 1.8rem;
  box-shadow: 0 0 20px #eee;
  background: none;
  border: none;
  outline: none;
  text-align: center;
  font-size: 1rem;

  width: 80%;
  max-width: 400px;
  margin: 0.5rem auto;
`;

const Option = styled.option``;

const Select = styled.select`
  height: 1.8rem;
  text-align: center;
  margin: 0 1rem 1rem 0;
  box-shadow: 0 0 20px #ddd;
  outline: none;
  border: none;
  font-weight: ${props => (props.selected ? '700' : '100')};

  width: 80%;
  max-width: 200px;
  margin: 0.1rem auto;

  cursor: pointer;
`;
class ActiveTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: null
    };

    this.dropDownHandler = this.dropDownHandler.bind(this);
    this.updateData = this.updateData.bind(this);
    this.hideChart = this.hideChart.bind(this);
    this.updateName = this.updateName.bind(this);
  }

  hideChart = id => {
    const hiddenCharts = this.props.hiddenCharts;
    const newVal = hiddenCharts.filter(chart => chart.id !== id);
    this.props.updateHiddenCharts(newVal);
  };

  dropDownHandler = (key, val) => {
    const { dataTitles, activeTab } = this.props.dashboard.state;
    const { updateTab } = this.props.dashboard.setters;

    activeTab[key] = val;

    // if catVal is changed, update data
    if (key === 'catVal') {
      this.updateData();
      return;
    }

    // if catKey is changed, reset val (and data)
    if (key === 'catKey') {
      const catRes = val === 'substances' ? 'sectors' : 'substances';
      activeTab.catVal = null;
      activeTab.catRes = catRes;
      activeTab.charts = [];
      activeTab.timespan = {
        from: Number(dataTitles.years[0]),
        to: Number(dataTitles.years[dataTitles.years.length - 1])
      };
    }

    updateTab(activeTab);
  };

  updateData = () => {
    const { activeTab, dataTitles } = this.props.dashboard.state;
    const { updateTab, setStorage } = this.props.dashboard.setters;
    const { catKey, catVal, catRes } = activeTab;

    const query = queryBakery(catKey, catVal);

    const processData = input => {
      const data = input.map((item, nth) => {
        const year = parseInt(item.key[2]);

        const sector = {
          name: dataTitles.sectors.filter(sect => sect.code === item.key[1])[0]
            .name,
          code: item.key[1]
        };

        //const substance = item.key[0];
        const substance = {
          name: dataTitles.substances.filter(
            subs => subs.code === item.key[0]
          )[0].name,
          code: item.key[0]
        };

        const value = parseInt(item.values[0]) || 0;

        /* return defaultChart({ year, sector, substance, value }, nth); */
        return {
          year,
          sector,
          substance,
          value
        };
      });

      // sort data based on category key/val
      const sortedObj = {};

      dataTitles[catRes].forEach(item => {
        sortedObj[item.code] = [];
      });

      const catResSingular = catRes.slice(0, -1);

      data.forEach((item, nth) => {
        const itemKey = item[catResSingular].code || item[catResSingular];

        sortedObj[itemKey].id = 'chart-' + nth;
        sortedObj[itemKey].push(item);
      });

      const sortedArr = Object.values(sortedObj);

      const charts = sortedArr.map((item, nth) => defaultChart(item, nth));
      //console.log('data sorted based on catKey/Val', sortedArr);

      activeTab.charts = charts;

      setStorage('activeTab', activeTab);
      updateTab(activeTab);
    };

    axios
      .post(proxy + apiUrl, query)
      .then(res => {
        processData(res.data.data);
      })
      .catch(error => {
        console.log('POST ERROR', error);
        processData(allEmissionData);
      });
  };

  updateName(e) {
    this.setState({
      name: e.target.value
    });
  }

  render() {
    const { dataTitles, tabIndex, activeTab: tab } = this.props.dashboard.state;
    const { updateTab } = this.props.dashboard.setters;

    const { catKey, catVal, catRes, data, name, timespan } = tab;

    const tabPlaceholder = 'Give this tab a name';

    const loaderEnter = Boolean(catVal && tab.charts.length < 1);
    const loaderExit = Boolean(tab.charts);

    return (
      <TabWrapper lassName={'Tab-' + tabIndex}>
        {tab.charts.length < 1 && <TabSettings />}

        <ChartsWrapper>
          {catVal ? <Charts /> : null}

          {this.props.children}
        </ChartsWrapper>
      </TabWrapper>
    );
  }
}

export default compose(withFirebase, withDashboard)(ActiveTab);