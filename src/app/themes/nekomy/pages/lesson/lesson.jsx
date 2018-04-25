import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router';
import { GoToAction, Deck, Image, ListItem, List, Slide, Text } from 'spectacle';
import createTheme from 'spectacle/lib/themes/default';
import { firebaseConnect, isLoaded } from 'react-redux-firebase';
import { setLoading } from '../../../../core/actions/actions';
import Icon from '../../../../core/common/lib/icon/icon';
import Night from '../../../../../../static/svg/night.svg';
import Home from '../../../../../../static/svg/home2.svg';

const themeNight = createTheme({
  primary: '#151515',
  secondary: '#fff',
  quarternary: '#fff'
});

const themeDefault = createTheme({
  primary: '#fff',
  secondary: '#444444',
  quarternary: '#444444'
});

class Lesson extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isNightMode: false,
    }
  };

  componentDidMount() {
    const el = document.querySelector('.js-main');
    this.props.setLoading(false);
    el.classList = '';
    el.classList.add('main', 'js-main', 'subject-page');
  };

  toggleNightMode = () => this.setState({ isNightMode: !this.state.isNightMode });

  render() {
    const { isNightMode } = this.state;

    return (
      <div className={`lesson ${isNightMode ? 'lesson--night' : ''}`}>
        <div className={'button-group'}>
          <button className={'night-mode'} onClick={this.toggleNightMode}>
            <Icon glyph={Night} style={{ fill: `${isNightMode ? 'white' : 'black'}` }} />
          </button>
          <Link className={'go-back'} to={`/subjects/${this.props.params.slug}`}>
            <Icon glyph={Home} style={{ fill: `${isNightMode ? 'white' : 'black'}` }} />
          </Link>
        </div>
        <div className={'lesson__presentation'}>
          <Deck transition={['slide']} progress={'bar'} theme={isNightMode ? themeNight : themeDefault}>
            <Slide>
              <h3 className={'slide__presentation-title'}>Introduction to Computer Networks</h3>
              <h2 className={'slide__title'}>Understanding Networks</h2>
              <p>Networks are everywhere—or so it seems. You can hardly do anything with data that does not involve a network. Like the human networks that we are all part of, computer networks let us share information and resources. In business, the reliance on networks is even more pervasive than in homes or schools.</p>
              <p>Networks help individuals and businesses alike save money, but they also help create income. Without a doubt, networking within the home will catch on over the next few years as it has in business. Soon, nearly all individuals in even moderately developed nations will have networked components throughout their homes. Those that don’t will be netologically disadvantaged because they will not be able to learn or to function at the same level as those who are networked.</p>
              <p className={'text--bold'}>You can choose any part of lesson below. All of these parts have test question at the end. Knowledge from the lessons will be useful during final test.</p>
              <div className={'slide__nav'}>
                <GoToAction slide={2}><p className={'jumper'}>Human networks</p></GoToAction>
                <GoToAction slide={7}><p className={'jumper'}>Computer networks</p></GoToAction>
                <GoToAction slide={9}><p className={'jumper'}>Benefits of networks</p></GoToAction>
                <GoToAction slide={11}><p className={'jumper'}>Types of networks</p></GoToAction>
              </div>
            </Slide>
            <Slide>
              <h3 className={'slide__presentation-title'}>Introduction to Computer Networks</h3>
              <h2 className={'slide__title'}>Human Networks</h2>
              <p>In its broadest sense, a network consists of two or more entities, or objects, sharing resources and information. Although this book is about computer networks, there are networks that don’t involve computers, and those networks are everywhere. You have grown accustomed to working with them, possibly without even knowing it. It may not matter to you that, in a basic sense, sharing (giving or getting) is a fundamental aspect of networking. You just know that you do it.</p>
              <div className={'slide__nav'}>
                <GoToAction slide={3}><p className={'jumper jumper--insider'}>Family network</p></GoToAction>
                <GoToAction slide={4}><p className={'jumper jumper--insider'}>Peer network</p></GoToAction>
                <GoToAction slide={5}><p className={'jumper jumper--insider'}>Restaurant network</p></GoToAction>
                <GoToAction slide={6}><p className={'jumper jumper--insider'}>Contact network</p></GoToAction>
              </div>
            </Slide>
            <Slide>
              <h3 className={'slide__presentation-title'}>Introduction to Computer Networks</h3>
              <h2 className={'slide__title'}>Human Networks. Family network</h2>
              <p>Most people belong to a family network in which related people share their resources and information. This sharing is bi-directional because even the youngest family members share information of some sort. As the family grows, so does the network.</p>
              <Image height={400} src={'https://firebasestorage.googleapis.com/v0/b/nekomylms.appspot.com/o/Screen%20Shot%202018-04-04%20at%2022.31.32.png?alt=media&token=9ef7dbdc-9c5b-4c97-963e-96d10f513eae'} />
              <div className={'slide__nav'}>
                <GoToAction slide={4}><p className={'jumper jumper--insider'}>Peer network</p></GoToAction>
                <GoToAction slide={5}><p className={'jumper jumper--insider'}>Restaurant network</p></GoToAction>
                <GoToAction slide={6}><p className={'jumper jumper--insider'}>Contact network</p></GoToAction>
              </div>
            </Slide>
            <Slide>
              <h3 className={'slide__presentation-title'}>Introduction to Computer Networks</h3>
              <h2 className={'slide__title'}>Human Networks. Peer network</h2>
              <p>Outside the family, there is a community that offers a wider array of resources than the typical family can provide. Naturally, it makes sense to connect the family to this community to take advantage of the wealth of resources available around town. This type of information/resource sharing can be as simple as loaning a hammer to a neighbor, car-pooling with work associates, or helping a friend with his or her homework. All of these activities involve sharing, or trading, resources. This kind of network is represented by a two-way relationship, a give and take among equals or peers.</p>
              <Image height={400} src={'https://firebasestorage.googleapis.com/v0/b/nekomylms.appspot.com/o/Screen%20Shot%202018-04-04%20at%2022.31.39.png?alt=media&token=7a13acae-699a-4a6f-93a4-86bdece9339a'} />
              <div className={'slide__nav'}>
                <GoToAction slide={5}><p className={'jumper jumper--insider'}>Restaurant network</p></GoToAction>
                <GoToAction slide={6}><p className={'jumper jumper--insider'}>Contact network</p></GoToAction>
              </div>
            </Slide>
            <Slide>
              <h3 className={'slide__presentation-title'}>Introduction to Computer Networks</h3>
              <h2 className={'slide__title'}>Human Networks. Restaurant network</h2>
              <p>The Client and the Server So, in any type of human network, there’s a lot of giving and taking. You’re already more accustomed to the client/server perspective in networking than you realize. For instance, when you go to dinner at a restaurant, you become a customer, or client, enjoying the food and drink prepared and served to you by the restaurant. On the other hand, the waiter works as a server, controlling and providing his customers with access to resources in the form of placing orders for and delivering food items. The server knows that requests will be made of him (access is sought when an order is placed) and that he will service those making the requests (access is granted when the order is delivered)</p>
              <Image height={400} src={'https://firebasestorage.googleapis.com/v0/b/nekomylms.appspot.com/o/Screen%20Shot%202018-04-04%20at%2022.32.00.png?alt=media&token=857db1c9-511a-4e6f-85be-f669219b923e'} />
              <div className={'slide__nav'}>
                <GoToAction slide={6}><p className={'jumper jumper--insider'}>Contact network</p></GoToAction>
              </div>
            </Slide>
            <Slide>
              <h3 className={'slide__presentation-title'}>Introduction to Computer Networks</h3>
              <h2 className={'slide__title'}>Human Networks. Contact network</h2>
              <p>Anyone who has looked for a job knows that one of the best ways to find a job is to network. That is, create a list of friends and associates who will help you find the perfect job. The more people you meet and get to know, the better your chances of obtaining work. As you develop and nurture your career, this contact network will serve you best because your role in it will hange as you gain more experience. Soon, you may be able to help the people who helped you. And as your personal and professional networks grow, so do your opportunities. These examples of human networks should help you understand that networking is common between people and is not just an activity restricted to computers. However, this book will focus on computer networks—connecting computers and having them communicate with each other</p>
              <Image height={400} src={'https://firebasestorage.googleapis.com/v0/b/nekomylms.appspot.com/o/Screen%20Shot%202018-04-04%20at%2022.32.10.png?alt=media&token=4c4bf3d4-ac80-4c82-92e7-91a7d39035f6'} />
              <div className={'slide__nav'}>
                <GoToAction slide={7}><p className={'jumper'}>Computer networks</p></GoToAction>
                <GoToAction slide={9}><p className={'jumper'}>Benefits of networks</p></GoToAction>
                <GoToAction slide={11}><p className={'jumper'}>Types of networks</p></GoToAction>
              </div>
            </Slide>

            {/* COMPUTER NETWORKS */}
            <Slide>
              <h3 className={'slide__presentation-title'}>Introduction to Computer Networks</h3>
              <h2 className={'slide__title'}>Computer Networks</h2>
              <p>A computer network consists of two or more computing devices that are connected in order to share the components of your network (its resources) and the information you store there, as shown in Figure 1.1.</p>
              <p>The most basic computer network (which consists of just two connected computers) can expand and become more usable when additional computers join and add their resources to those being shared.</p>
              <Image height={400} src={'https://firebasestorage.googleapis.com/v0/b/nekomylms.appspot.com/o/Screen%20Shot%202018-04-04%20at%2022.50.46.png?alt=media&token=0bf91102-03ae-49ae-b3f7-27fe00f696ec'} />
              <div className={'slide__nav'}>
                <GoToAction slide={8}><p className={'jumper jumper--insider'}>Utilities</p></GoToAction>
              </div>
            </Slide>
            <Slide>
              <h3 className={'slide__presentation-title'}>Introduction to Computer Networks</h3>
              <h2 className={'slide__title'}>Computer Networks. Utilities</h2>
              <p>The first computer, yours, is commonly referred to as your local computer. It is more likely to be used as a location where you do work, a workstation, than as a storage or controlling location, a server. As more and more computers are connected to a network and share their resources, the network becomes a more powerful tool, because employees using a network with more information and more capability are able to accomplish more through those added computers or additional resources.</p>
              <p>The real power of networking computers becomes apparent if you envision your own network growing and then connecting it with other distinct networks, enabling communication and resource sharing across both networks. That is, one network can be connected to another network and become a more powerful tool because of the greater resources.</p>
              <p><span className={'text--bold'}>For example,</span>&nbsp;you could connect the network you and your classmates develop for this course to similarly constructed networks from other introductory networking classes if you wanted them to share your information and networked resources. Those classes could be within your own school, or they could be anywhere in the world. Wherever that newly joined network is, the communication and resource sharing activities in that new network could then be shared with anyone connected to your network.</p>
              <p>All you have to do is join that new network&rsquo;s community or allow its members to join yours. In addition, a company&rsquo;s cost of doing business can be reduced as a result of sharing data (defined as a piece or pieces of information) and resources. Instead of having individual copies of the data at several locations around the company, and needing to keep all of them similarly updated, a company using a network can have just one shared copy of that data and share it, needing to keep only that one set of data updated.</p>
              <p>Furthermore, sharing networked resources (like printers) means that more people can use a particular resource and a wider variety of resources (like different printers) can be used by each network user. Any time a company can do more with less, or buy fewer items to do the same job, its total costs are reduced, and it is able to make more money per dollar spent.</p>
              <div className={'slide__nav'}>
                <GoToAction slide={9}><p className={'jumper'}>Benefits of networks</p></GoToAction>
                <GoToAction slide={11}><p className={'jumper'}>Types of networks</p></GoToAction>
              </div>
            </Slide>

            {/* BENEFITS OF NETWORKS */}
            <Slide>
              <h3 className={'slide__presentation-title'}>Introduction to Computer Networks</h3>
              <h2 className={'slide__title'}>Benefits of networks</h2>
              <p>In the early days of the personal computer (PC), during the late &rsquo;70s and early &rsquo;80s, often a PC was used as a stand-alone computer and operated independently from other computers, as shown in Figure 1.3. When, over the span of just those few years, their use proliferated and more PCs were found relatively close to each other, users began sharing information. The information was either printed out or copied from one computer to another using backup or storage devices, such as tapes, disks, or other digital storage media. The printout or the storage device was then physically carried to another computer where the information was reentered or copied from the portable media into the next computer.</p>
              <p>This process was referred to as a sneakernet because users actually had to walk from computer to computer. It was&nbsp;probably the cheapest type of network&mdash;unless the computers were large distances apart or the information needed to be shared among many computers. Other drawbacks to sneakernets were that printouts were often bulky, and the storage devices could hold a relatively small amount of data compared to the large amount of output users produced.</p>
              <div className={'slide__nav'}>
                <GoToAction slide={10}><p className={'jumper jumper--insider'}>Essential benefits</p></GoToAction>
              </div>
            </Slide>
            <Slide>
              <h3 className={'slide__presentation-title'}>Introduction to Computer Networks</h3>
              <h2 className={'slide__title'}>Benefits of networks. Essential</h2>
              <ul>
                <li>Computers operated independently from others are known as stand-alone computers.</li>
                <li>Most computer networks develop to facilitate communication, initially to share output and later to communicate through e-mail.</li>
                <li>The ability to share resources is another main purpose for initiating networks.</li>
                <li>Peripherals are additional components that attach to computers to expand their use.</li>
                <li>Sharing peripherals, such as printers, often offered enough of a cost savings for companies to invest in networks.</li>
                <li>Large computers can be set up as storage locations where data is offloaded and access to it is controlled by the person storing the data.</li>
                <li>Installing an application on a network and then sharing its use cuts down on the storage space required when multiple users need the same application.</li>
                <li>Coworkers discussing each other&rsquo;s work, or collaboration, assisted the widespread use of computers.</li>
                <li>Networks help centralize the management of software and maintenance of computers, such as installing upgrades and backing up data</li>
              </ul>
              <div className={'slide__nav'}>
                <GoToAction slide={11}><p className={'jumper'}>Types of networks</p></GoToAction>
              </div>
            </Slide>

            {/* TYPES OF NETWORKS */}
            <Slide>
              <h3 className={'slide__presentation-title'}>Introduction to Computer Networks</h3>
              <h2 className={'slide__title'}>Types of networks</h2>
              <p>In the early days of the personal computer (PC), during the late &rsquo;70s and early &rsquo;80s, often a PC was used as a stand-alone computer and operated independently from other computers, as shown in Figure 1.3. When, over the span of just those few years, their use proliferated and more PCs were found relatively close to each other, users began sharing information. The information was either printed out or copied from one computer to another using backup or storage devices, such as tapes, disks, or other digital storage media. The printout or the storage device was then physically carried to another computer where the information was reentered or copied from the portable media into the next computer.</p>
              <p>This process was referred to as a sneakernet because users actually had to walk from computer to computer. It was&nbsp;probably the cheapest type of network&mdash;unless the computers were large distances apart or the information needed to be shared among many computers. Other drawbacks to sneakernets were that printouts were often bulky, and the storage devices could hold a relatively small amount of data compared to the large amount of output users produced.</p>
              <div className={'slide__nav'}>
                <GoToAction slide={10}><p className={'jumper jumper--insider'}>Essential benefits</p></GoToAction>
              </div>
            </Slide>
          </Deck>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  setLoading
};

const mapStateToProps = ({
  mainReducer: {
    isDesktop,
    userData
  }
}) => ({ isDesktop, userData });

const enhance = compose(
  firebaseConnect(props => [
    `subjects#orderByChild=slug&equalTo=${props.params.slug}`,
    'users',
    `users/${props.userID}`
  ]),
  connect(state => ({
    subject: state.firebase.data.subjects,
    users: state.firebase.data.users
  })),
  connect(mapStateToProps, mapDispatchToProps)
);

export default enhance(Lesson);
