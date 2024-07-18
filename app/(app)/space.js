import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import SpaceCard from '../../components/SpaceCard';
import CreateSpaceModal from '../../components/CreateSpaceModal';
import JoinSpaceModal from '../../components/JoinSpaceModal';
import { useAuth } from '../../context/authContext';
import { collection, doc, getDoc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../firebaseConfig';


export default function Space() {
  const {user} = useAuth();

  const [spaces, setSpaces] = useState([]);
  const [createSpaceModalodalVisible, setCreateSpaceModalVisible] = useState(false);
  const [joinSpaceModalodalVisible, setJoinSpaceModalVisible] = useState(false);

  const getSpacesForUser = (userId) => {
    try {
      const userSpacesRef = collection(db, "userSpaces");
      const q = query(userSpacesRef, where("userId", "==", userId));
  
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const spacePromises = querySnapshot.docs.map((snapShot) => {
          const spaceDocRef = doc(db, "spaces", snapShot.data().spaceId);
          return getDoc(spaceDocRef);
        });
  
        Promise.all(spacePromises).then((spaceDocs) => {
          const allSpaces = spaceDocs.map((spaceDoc) => spaceDoc.data());
          setSpaces([...allSpaces]);
        });
      });
  
      return unsubscribe;
    } catch (error) {
      console.log("Error:", error);
    }
  };
  
  useEffect(()=> {
    getSpacesForUser(user?.userId);
  },[user?.userId])
  
  return (
    <View  style={{paddingTop: hp(2), paddingHorizontal: wp(5)}} className="flex-1 gap-5">
      <View className="flex-row justify-between">
        <TouchableOpacity
        style={{ height: hp(6.5), backgroundColor: '#4F46E5', borderRadius: 8, justifyContent: 'center', alignItems: 'center', width: wp(40) }}
        className="bg-indigo-500 rounded-lg justify-center items-center"
        onPress={() => setJoinSpaceModalVisible(true)}
        >
          <Text style={{ fontSize: hp(2.5)}} className="text-white font-bold ">Join Space</Text>
        </TouchableOpacity>
        <TouchableOpacity
        style={{ height: hp(6.5), backgroundColor: '#4F46E5', borderRadius: 8, justifyContent: 'center', alignItems: 'center', width: wp(40) }}
        className="bg-indigo-500 rounded-lg justify-center items-center"
        onPress={() => setCreateSpaceModalVisible(true)}
        >
          <Text style={{ fontSize: hp(2.5)}} className="text-white font-bold ">Create Space</Text>
        </TouchableOpacity>
      </View>
      <Text className="font-bold text-2xl text-black">Space List</Text>
      {spaces.length ? <SpaceCard spaces={spaces} /> : <Text className="text-center text-xl pt-5">No Spaces Found</Text>}

      <CreateSpaceModal modalVisible={createSpaceModalodalVisible} setModalVisible={setCreateSpaceModalVisible}/>
      <JoinSpaceModal modalVisible={joinSpaceModalodalVisible} setModalVisible={setJoinSpaceModalVisible}/>
    </View>
  )
}