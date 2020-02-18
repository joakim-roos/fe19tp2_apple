import React, { Component } from 'react';
import axios from 'axios';
import Table from './Table';
import md5 from 'md5';

import Timespan from './Timespan';
import Preview from './Preview';

const proxy = 'https://cors-anywhere.herokuapp.com/';
const emissionTable =
  'http://api.scb.se/OV0104/v1/doris/sv/ssd/START/MI/MI0108/TotaltUtslapp';

const queryBakery = {
  /* const substancesAdded = this.state.substancesAdded.map(item => item.code)
  const sectorsAdded = this.state.sectorsAdded.map(item => item.code) */

  query: [
    {
      code: 'Luftfororening',
      selection: {
        filter: 'item',
        values: ['BC'] // this value should be updated depending on substancesAdded-state
      }
    },
    {
      code: 'Sektor',
      selection: {
        filter: 'item',
        values: ['0.5'] // this value should updated depending on sectorsAdded-state
      }
    }
  ],
  response: { format: 'json' }
};

class Charts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      dataRequest: [],
      substances: [],
      sectors: [],
      years: [],
      limit: { from: 0, to: 28 },
      isLoading: false,

      substancesAdded: [],
      sectorsAdded: [],
      yearsAdded: []
    };
    this.getEmissionData = this.getEmissionData.bind(this);
    this.postEmissionData = this.postEmissionData.bind(this);
    this.tableHandler = this.tableHandler.bind(this);
    this.pushLimitHandler = this.pushLimitHandler.bind(this);
    this.setActiveClass = this.setActiveClass.bind(this);
  }

  componentDidMount() {
    this.getEmissionData();
    /* this.postEmissionData(queryBakery); */
  }

  //Bug - if you go further back then data[0] (so limit: to: becomes -1 or more the app crashes)
  pushLimitHandler(endPoint, reaseType) {
    let oldLimit = this.state.limit;

    if (reaseType === 'dec') {
      if (oldLimit[endPoint] <= 0) return;
      oldLimit[endPoint]--;
    } else {
      if (oldLimit[endPoint] >= this.state.years.length - 1) return;
      oldLimit[endPoint]++;
    }

    this.setState({
      limit: oldLimit
    });
  }

  /* lastLimitHandler(startPoint) {
    let limit = this.state.limit;
    if (reaseType === "dec") {
      console.log('dec')
      limit[startPoint]--;
    } else {
      limit[startPoint]++;
    };

    this.setState({
      limit: {
        from: limit.from,
        to: limit.to
      }
    });
  } */

  tableHandler = (item, array) => {
    const indicator = array === 'substancesAdded' ? 0 : 1;
    const oldArray = this.state[array];
    let newArr;
    oldArray.includes(item)
      ? this.setState(prevState => {
          newArr = prevState[array].filter(el => el !== item);
          console.log(newArr);
          const substancesAdded = newArr.map(item => item.code);
          const sectorsAdded = newArr.map(item => item.code);

          queryBakery.query[indicator].selection.values =
            indicator === 0 ? substancesAdded : sectorsAdded;
          this.postEmissionData(queryBakery);
          return {
            [array]: newArr
          };
        })
      : this.setState(prevState => {
          newArr = [...prevState[array], item];
          console.log(newArr);
          const substancesAdded = newArr.map(item => item.code);
          /* const sectorsAdded = newArr.map(item => item.code); */

          queryBakery.query[indicator].selection.values = substancesAdded;

          this.postEmissionData(queryBakery);
          return {
            [array]: newArr
          };
        });
    /* this.postEmissionData(queryBakery); */ //don't think we need another request here.
  };

  setActiveClass = (item, array) => {
    const ifArray = array;
    return ifArray.includes(item) ? 'active' : '';
  };

  getEmissionData() {
    axios
      .get(proxy + emissionTable)
      .then(res => {
        const substances = res.data.variables[0].values.map((item, nth) => ({
          name: res.data.variables[0].valueTexts[nth],
          code: item
        }));

        const sectors = res.data.variables[1].values.map((item, nth) => ({
          name: res.data.variables[1].valueTexts[nth],
          code: item
        }));

        const years = res.data.variables[3].values;

        const dataRequest = res;

        this.setState({
          substances,
          sectors,
          years,
          dataRequest
        });
      })
      .catch(error => {
        console.log('GET ERROR', error);
      });
  }

  postEmissionData(query) {
    const queryHash = md5(JSON.stringify(query));

    const cache = JSON.parse(localStorage.getItem('dataCache'));

    // if cache object doesn't exists, create it
    if (!cache) localStorage.setItem('dataCache', JSON.stringify({}));

    // if cache found and not older than 1 week
    if (
      cache[queryHash] &&
      cache[queryHash].timeStamp > Date.now() - 504000000
    ) {
      // update data in state
      this.setState({ data: cache[queryHash].data });
    } else {
      // if not found in cache then fetch from API
      axios
        .post(proxy + emissionTable, query)
        .then(res => {
          const data = res.data.data.map(item => {
            const year = item.key[2];
            const sector = item.key[1];
            const substance = item.key[0];
            const toParse = item.values[0];
            const values = parseInt(toParse);

            return {
              year,
              sector,
              substance,
              values
            };
          });

          // add data to cache
          cache[queryHash] = { data, timeStamp: Date.now() };
          localStorage.setItem('cache', JSON.stringify(cache));

          this.setState({ data });
        })
        .catch(error => {
          console.log('POST ERROR', error);
        });
    }
  }

  render() {
    const data = this.state.data;
    const totalTimespan = data ? data.length - 1 : 0;

    return (
      <div>
        <Table
          setActiveClass={this.setActiveClass}
          tableHandler={this.tableHandler}
          category={this.state}
        />

        {this.state.data ? (
          <Preview
            data={this.state.data}
            sectors={this.state.sectors}
            limit={this.state.limit}
          >
            {' '}
            >
          </Preview>
        ) : null}

        <Timespan
          limit={this.state.limit}
          /* update={(key, val) => this.updateConfig(key, val)} */
          totalTimespan={totalTimespan}
          pushLimitHandler={this.pushLimitHandler}
        />
      </div>
    );
  }
}

export default Charts;
