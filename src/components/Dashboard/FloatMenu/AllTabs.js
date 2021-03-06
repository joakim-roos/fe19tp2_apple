import React, { Component } from 'react';
import { compose } from 'recompose';
import { withTheme } from '../../Theme/context';
import { withDashboard } from '../context';
import AddTabBtn from './AddTabBtn';

import { Wrapper, ToggleBtn, List, Item, Label, Btn } from './styledElems';

import IconTemplate, { icons } from '../../../media/icons';

class AllTabs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      deleting: false,
      deleteMsg: null
    };

    this.toggleOpen = this.toggleOpen.bind(this);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.setListRef = this.setListRef.bind(this);
    this.outsideClickHandler = this.outsideClickHandler.bind(this);
  }

  // on mount, listen for doc click
  componentDidMount() {
    document.addEventListener('mousedown', this.outsideClickHandler, false);
  }

  // remove listener on unmount
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.outsideClickHandler, false);
  }

  // set wrapper ref, called by ref-selector itself
  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  // set list ref, called by ref-selector itself
  setListRef(node) {
    this.listRef = node;
  }

  // handle clicks, determine if target is sidemenu
  outsideClickHandler(e) {
    const tabMenuChild = e.target.closest('.tabMenuWrapper');

    if (this.state.isOpen && tabMenuChild !== this.wrapperRef) {
      this.toggleOpen();
    }
  }

  deleteHandler(tab) {
    const { state, setters } = this.props.dashboard;
    const tabName = tab.name || tab.id;

    const after = () => {
      if (state.tabs.length < 1) return;
      this.setState({
        deleting: false,
        deleteMsg: null
      });
    };

    this.setState({
      deleting: true,
      deleteMsg: tabName + ' deleted'
    });

    setters.deleteTab(tab, after);
  }

  toggleOpen() {
    // scroll to list top
    this.listRef.scrollTop = this.listRef.scrollTop > 0 && 0;

    // update state
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    //theme ctx

    //dashboard ctx
    let { tabs, activeTab } = this.props.dashboard.state;
    const { setActiveTab } = this.props.dashboard.setters;

    const activeId = activeTab ? activeTab.id : null;

    const isOpen = this.state.isOpen;

    return (
      <>
        <Wrapper ref={this.setWrapperRef} className="tabMenuWrapper">
          <ToggleBtn
            onClick={this.toggleOpen}
            isOpen={isOpen}
            tabsExist={tabs.length > 0}
            radius={
              this.props.chartLen > 0 || isOpen ? '0 10px 0 0' : '0 10px 10px 0'
            }
          >
            <IconTemplate src={icons.briefcase} />
          </ToggleBtn>

          <List className="TabList" isOpen={isOpen} ref={this.setListRef}>
            <Item>
              <Label fat>Tabs</Label> <AddTabBtn />
            </Item>
            {tabs.map(tab => {
              let tabName = tab.name;

              if (tabName.length > 20) {
                tabName = tabName.slice(0, 20) + '...';
              }

              return (
                <Item key={tab.id}>
                  <Btn
                    weight={tab.id === activeId && '700'}
                    onClick={() => setActiveTab(tab)}
                    margin="auto 0.4rem auto 0"
                    flex="1"
                    align="left"
                    childLineHeight="line-height: 0"
                  >
                    <Label>{tabName || `(${tab.id})`}</Label>
                  </Btn>
                  <Btn onClick={() => this.deleteHandler(tab)}>
                    <IconTemplate src={icons.deleteCross} />
                  </Btn>
                </Item>
              );
            })}
          </List>
        </Wrapper>
      </>
    );
  }
}

export default compose(withTheme, withDashboard)(AllTabs);
