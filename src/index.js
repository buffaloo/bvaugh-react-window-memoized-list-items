import React, { PureComponent, memo } from "react";
import ReactDOM from "react-dom";
import memoize from "memoize-one";
import { FixedSizeList as List, areEqual } from "react-window";
import "./styles.css";

//https://github.com/bvaughn/react-window

const generateItems = numItems =>
  Array(numItems)
    .fill(true)
    .map(_ => ({
      isActive: false,
      label: Math.random()
        .toString(36)
        .substr(2)
    }));

// If list items are expensive to render,
// Consider using PureComponent to avoid unnecessary re-renders.
// https://reactjs.org/docs/react-api.html#reactpurecomponent
const Row = memo(({ data, index, style }) => {
  // Data passed to List as "itemData" is available as props.data
  const { items, toggleItemActive } = data;
  const item = items[index];

  return (
    <div
      onClick={() => toggleItemActive(index)}
      className={index % 2 ? "ListItemOdd" : "ListItemEven"}
      style={style}
    >
      {item.label} is{" "}
      <span style={item.isActive ? spanStyleActive : spanStyleInActive}>
        {item.isActive ? " active" : " inactive"}
      </span>
    </div>
  );
}, areEqual);

// This helper function memoizes incoming props,
// To avoid causing unnecessary re-renders pure Row components.
// This is only needed since we are passing multiple props with a wrapper object.
// If we were only passing a single, stable value (e.g. items),
// We could just pass the value directly.
const createItemData = memoize((items, toggleItemActive) => ({
  items,
  toggleItemActive
}));

const divStyle = {
  margin: "4px",
  border: "5px solid pink"
};

const spanStyleActive = {
  color: "green",
  padding: "4px"
};

const spanStyleInActive = {
  color: "red",
  padding: "4px"
};

// In this example, "items" is an Array of objects to render,
// and "toggleItemActive" is a function that updates an item's state.
function Example({ height, items, toggleItemActive, width }) {
  // Bundle additional data to list items using the "itemData" prop.
  // It will be accessible to item renderers as props.data.
  // Memoize this data to avoid bypassing shouldComponentUpdate().
  const itemData = createItemData(items, toggleItemActive);

  return (
    <List
      height={height}
      itemCount={items.length}
      itemData={itemData}
      itemSize={35}
      width={width}
      style={divStyle}
    >
      {Row}
    </List>
  );
}

//https://codeburst.io/when-to-use-component-or-purecomponent-a60cfad01a81
class ExampleWrapper extends PureComponent {
  state = {
    items: generateItems(1002)
  };

  toggleItemActive = index =>
    this.setState(prevState => {
      const item = prevState.items[index];
      //  Using concat with no arguments can be used to copy an array. For example:
      const items = prevState.items.concat();
      items[index] = {
        ...item,
        isActive: !item.isActive
      };
      return { items };
    });

  render() {
    return (
      <Example
        height={550}
        items={this.state.items}
        toggleItemActive={this.toggleItemActive}
        width={300}
      />
    );
  }
}

ReactDOM.render(<ExampleWrapper />, document.getElementById("root"));
