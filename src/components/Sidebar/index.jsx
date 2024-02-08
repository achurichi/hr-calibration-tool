import React from "react";
import Nav from "react-bootstrap/Nav";

import { BsChevronLeft, BsEmojiLaughing, BsWrench } from "react-icons/bs";
import { GiLips } from "react-icons/gi";

import "./index.scss";

const Sidebar = () => {
  return (
    <Nav className="sidebar" activeKey="/home" onSelect={() => {}}>
      <div className="sidebar_collapse">
        <BsChevronLeft size={20} />
      </div>
      <Nav.Item className="sidebar_item">
        <Nav.Link className="sidebar_item_link" eventKey="link-1">
          <BsWrench size={20} />
          Motors calibration
        </Nav.Link>
      </Nav.Item>
      <Nav.Item className="sidebar_item">
        <Nav.Link className="sidebar_item_link" eventKey="link-2">
          <GiLips size={20} />
          Visemes calibration
        </Nav.Link>
      </Nav.Item>
      <Nav.Item className="sidebar_item">
        <Nav.Link className="sidebar_item_link" eventKey="link-3">
          <BsEmojiLaughing size={20} />
          Expressions calibration
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
};

export default Sidebar;
