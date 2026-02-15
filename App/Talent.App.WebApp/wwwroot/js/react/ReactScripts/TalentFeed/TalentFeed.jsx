import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import TalentCard from '../TalentFeed/TalentCard.jsx';
import { Loader } from 'semantic-ui-react';
import CompanyProfile from '../TalentFeed/CompanyProfile.jsx';
import FollowingSuggestion from '../TalentFeed/FollowingSuggestion.jsx';
import { BodyWrapper, loaderData } from '../Layout/BodyWrapper.jsx';

export default class TalentFeed extends React.Component {
    constructor(props) {
        super(props);

        let loader = loaderData
        loader.allowedUsers.push("Employer")
        loader.allowedUsers.push("Recruiter")

        this.state = {
            loadNumber: 5,
            loadPosition: 0,
            feedData: [],
            watchlist: [],
            loaderData: loader,
            loadingFeedData: false,
            hasMoreData: true,
            companyDetails: null
        }

        this.init = this.init.bind(this);
        this.loadMoreTalentCards = this.loadMoreTalentCards.bind(this);
        this.setupObserver = this.setupObserver.bind(this);
        this.observerTarget = React.createRef();

    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.setState({ loaderData });
    }

    componentDidMount() {
        this.init();
        this.loadMoreTalentCards();
    };

    componentDidUpdate(prevProps, prevState) {
        if (!prevState.feedData.length && this.state.feedData.length && this.observerTarget.current) {
            this.setupObserver();
        }
    }

    setupObserver() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(
                (entries) => {
                    const [entry] = entries;
                    if (entry.isIntersecting && this.state.hasMoreData && !this.state.loadingFeedData) {
                        this.loadMoreTalentCards();
                    }
                },
                { root: null, threshold: 1.0 }
            );

            if (this.observerTarget.current) {
                observer.observe(this.observerTarget.current);
            }
        }
    }

    loadMoreTalentCards() {
        const { loadNumber, loadPosition, feedData } = this.state;
        this.setState({ loadingFeedData: true });

        try {
            var cookies = Cookies.get('talentAuthToken');
            $.ajax({
                url: 'https://advanceapi.azurewebsites.net/api/mobile/getTalentSnapshotList',
                headers: {
                    'Authorization': 'Bearer ' + cookies,
                    'Content-Type': 'application/json'
                },
                type: "GET",
                contentType: "application/json",
                dataType: "json",
                data: {
                    position: loadPosition,
                    number: loadNumber
                },
                success: function (res) {
                    const newFeedData = res.data;
                    if (newFeedData) {
                        this.setState({
                            feedData: [...feedData, ...newFeedData],
                            loadPosition: loadPosition + loadNumber,
                            hasMoreData: newFeedData.length === loadNumber, 
                        });
                    }
                }.bind(this),
                error: function (res) {
                }
            })
        }
        catch (err) {
        }
        finally {
            this.setState({ loadingFeedData: false });
        }
    }

    renderTalentCards() {
        const { feedData } = this.state;

        if (feedData.length === 0) {
            return (
                <div className="ui center aligned container">
                    There are no talents found for your recruitment company.
                </div>
            );
        } else {
            return feedData.map((talent) => {
                return <TalentCard key={talent.id} talent={talent} />;
            });
        }

    }

    render() {
        const { loadingFeedData } = this.state;

        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <div className="ui grid talent-feed container">
                    <div className="four wide column">
                        <CompanyProfile />
                    </div>
                    <div className="eight wide column">
                        {this.renderTalentCards()}

                        <div ref={this.observerTarget}> </div>

                        {loadingFeedData && <Loader active inline='centered' />}
                    </div>
                    <div className="four wide column">
                        <div className="ui card">
                            <FollowingSuggestion />
                        </div>
                    </div>
                </div>
            </BodyWrapper>
        )
    }
}