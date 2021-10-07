import React, {Component} from 'react';
import './Friends.css';
// import images from '../../Assets';
import {cloneDeep, isEmpty} from 'lodash';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import ShowFriend from '../ShowFriend/ShowFriend';


export default class Friends extends Component {
    constructor(props) {
        super(props);
        this.recordsPerPage = 4
        this.state = {
            friendList: [],
            friendName: '',
            searchFriend: '',
            allFriends: [],
            errorMessage: '',
            currentPage: 1
        };
    }
    getFriendName = (e) => {
        if (e.target.value.length === 0 && this.state.errorMessage.length > 0) {
            this.setState({errorMessage: ''});
        }   
        this.setState({friendName: e.target.value});
    }

    validateFriend = (e) => {
        let errorMessage = ''
        if (!(/^([a-zA-Z]+\s)*[a-zA-Z]+$/gi.test(this.state.friendName))) {
            errorMessage = 'Please use alphabets. Only one space is allowed between names';
        } else if (e.target.value.length === 0) {
            errorMessage = `Name can't be blank`;
        }else if (e.target.value.length < 3) {
            errorMessage = 'Name is too short';
        } 
        this.setState({errorMessage: errorMessage});
        return errorMessage;
    }

    enterPressed = (e) => {
        this.setState({errorMessage: ''});
        if (e.charCode === 13) {     
            if (this.validateFriend(e).length === 0) {
                this.setState( prevState => ({
                    // friendList : [...prevState.friendList, this.changePage(1)],
                    allFriends : [...prevState.allFriends, {name: e.target.value, isFavorite: false}],
                    friendName: ''              
                }), () => this.changePage(this.state.currentPage));
                // this.setState({friendName: ''});
            }
        } 
    }

    searchFriendName = (e) => {
        const friendsAvail = this.state.allFriends.filter(friend => {
            if (e.target.value.length > 0 && friend.name.toLowerCase().includes(e.target.value.toLowerCase())) {
                return friend;
            }
            return false;
        });
        this.setState({
            friendList : friendsAvail,
            searchFriend: e.target.value
        });
    }

    // handle favorite  -  add parameter to check add or remove
    // removeFavorite = (index) => {
    //     const friendList = cloneDeep(this.state.friendList);
    //     const allFriends = cloneDeep(this.state.allFriends);
    //     const notFavoriteFriend = friendList.slice(index, index+1);
    //     if (notFavoriteFriend && notFavoriteFriend.length > 0) {
    //         notFavoriteFriend[0].isFavorite = false;
    //         allFriends.splice(allFriends.map(item => item.name).indexOf(notFavoriteFriend[0].name), 1);
    //     }
    //     this.setState({allFriends: [...allFriends, ...notFavoriteFriend]}, this.changePage); 
    // }

    handleFavorite = (index, action) => {
        const friendList = cloneDeep(this.state.friendList);
        const allFriends = cloneDeep(this.state.allFriends);
        const favoriteFriend = friendList.slice(index, index+1);
        if (action === "ADD_FAVORITE") {
            if (favoriteFriend && favoriteFriend.length > 0) {
                favoriteFriend[0].isFavorite = true;
                allFriends.splice(allFriends.map(item => item.name).indexOf(favoriteFriend[0].name), 1);
            }
            this.setState({allFriends: [...favoriteFriend, ...allFriends]}, this.changePage) 
        } else if (action === "REMOVE_FAVORITE") {
            if (favoriteFriend && favoriteFriend.length > 0) {
                favoriteFriend[0].isFavorite = false;
                allFriends.splice(allFriends.map(item => item.name).indexOf(favoriteFriend[0].name), 1);
            }
            this.setState({allFriends: [...allFriends, ...favoriteFriend]}, this.changePage); 
        }

    }

    // Modal implement
    removeFriend = (index) => {
        const confirmation = window.confirm(`Do you want to remove ${this.state.allFriends[index].name} from friendlist?`);
        if (confirmation) {
            const toBeRemoved = cloneDeep(this.state.allFriends);
            toBeRemoved.splice(index, 1);
            // this.setState({friendList: toBeRemoved});
            this.setState({allFriends: toBeRemoved}, this.changePage);
        }

    }
        
    prevPage = () =>
    {
        if (this.state.currentPage > 1) {
            this.setState(prevState => ({
                currentPage: prevState.currentPage - 1
            }), this.changePage);
            
        }
    }

    numPages = () =>
    {   
        const allFriends = [...this.state.allFriends];
        return Math.ceil(allFriends.length / this.recordsPerPage);
    }
    
    nextPage = () =>
    {
        let num = this.numPages()     ;
        if (num > this.state.currentPage) {
            this.setState(prevState => ({
                currentPage: prevState.currentPage + 1
            }), () => this.changePage(this.state.currentPage));
        }
    }
    changePage = () =>
    {
        let listingTable = [];
        // Validate page
        // if (page < 1) page = 1;
        // if (page > this.numPages()) page = this.numPages();

        if (this.state.allFriends && this.state.allFriends.length > 0) {
            for (let i = (this.state.currentPage-1) * this.recordsPerPage; i < (this.state.currentPage * this.recordsPerPage); i++) {
                if (!isEmpty(this.state.allFriends[i])) {
                    listingTable.push(this.state.allFriends[i]);
                }
            }
        }  
        this.setState({friendList: listingTable})
    }

    showNextPage = () => {
        if (this.state.currentPage < this.numPages() && (this.state.allFriends && this.state.allFriends.length > 4)) {
            return true;
        }
        return false;
    }

    showPreviousPage = () => {
        if (this.state.currentPage > 1 && (this.state.allFriends && this.state.allFriends.length > 4)) {
            return true;
        }
        return false;
    }

    render() {
        // const star = require('../../Assets/star.png');
        return (
            <div className="friends" onClick={() => this.changePage(this.state.currentPage)}>
                <p className="friend-list general bold">Friends List</p>
                <input 
                    type="text"
                    value={this.state.friendName}
                    placeholder="Enter your friend's name"
                    onKeyPress={(e) => this.enterPressed(e)}
                    className="input-style general"
                    onChange={(e) => this.getFriendName(e)}  
                />
                {this.state.errorMessage.length > 0 && 
                    <ErrorMessage errorMessage={this.state.errorMessage} />
                }
                {this.state.allFriends && this.state.allFriends.length > 1 &&
                <input 
                    type="text"
                    value={this.state.searchFriend}
                    placeholder="Search Friends"
                    className="input-style general"
                    onChange={(e) => this.searchFriendName(e)}  
                />}
                {this.state.friendList.map((friend, index) => {
                    return (
                        <ShowFriend 
                            friend={friend}
                            index={index}
                            handleFavorite={this.handleFavorite}
                            removeFriend={this.removeFriend}
                        />
                    );
                })}
                {/* <div id="listingTable"></div> */}
                <div>
                    Current Page: <span className="status bold">{this.state.currentPage}</span>
                    Total Friends: <span className="status bold">{this.state.allFriends.length}</span>
                </div>
                <div className="friend">
                    {this.showNextPage() &&
                    <span onClick={() => this.nextPage()} className="status bold cursor">Next</span>}
                </div>
                <div className="friend">
                    {this.showPreviousPage() &&
                    <span onClick={() => this.prevPage()} className="status bold cursor">Prev</span>}                  
                </div>
            </div>
        );
    };
}