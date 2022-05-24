import { st } from '@smiley-uriux/stcss';

const Title = st()({
    el: 'h1',
    css: {
        color: ['green', 'red'],
    },
    render: ({ C, attrs }) => {
        return <C {...attrs} />;
    },
});

const IndexPage = () => <Title>Test</Title>;

export default IndexPage;
