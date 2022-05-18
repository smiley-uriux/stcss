export const onRenderBody = ({ setHeadComponentss}, pluginOptions) => {
    setHeadComponents([
      <style id="st-css-styles" key="st-css-styles" dangerouslySetInnerHTML={{ __html: stCss.toString() }} />,
    ]);
  };
