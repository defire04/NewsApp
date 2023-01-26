export function createElement(elementValue, props, ...children) {
    const element = document.createElement(elementValue);
    Object.entries(props || {}).forEach(([name, value]) => {
        if (name.startsWith('on')) {
            element[name.toLowerCase()] = value;
        } else {
            element.setAttribute(name, value);
        }
    });

    children.forEach((child) => appendChild(element, child));

    return element;
}


const appendChild = (parent, child) => {
    if (Array.isArray(child))
        child.forEach((nestedChild) => appendChild(parent, nestedChild));
    else
        parent.appendChild(
            child.nodeType ? child : document.createTextNode(child)
        );
};