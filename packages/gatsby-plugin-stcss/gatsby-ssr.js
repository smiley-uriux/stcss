export const onRenderBody = ({ setHeadComponentss}, pluginOptions) => {
    setHeadComponents([
      <style dangerouslySetInnerHTML={{ __html: '' }} />,
    ]);
  };
