import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';

import ConfirmModal from '../../components/ConfirmModal';

import API from '../../utils/axios';
import { showError, showSuccess } from '../../utils/toast';
import { useWedding } from '../../context/WeddingContext';

export default function MembersScreen({ navigation }: any) {
  const { activeWedding } = useWedding();

  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 🔴 Delete
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [removing, setRemoving] = useState(false);

  // 🟡 Role Update
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [updatingRole, setUpdatingRole] = useState(false);

  // 🔥 Fetch Members
  const fetchMembers = async (isRefreshing = false) => {
    try {
      if (!activeWedding?.id) {
        setMembers([]);
        setLoading(false);
        return;
      }

      isRefreshing ? setRefreshing(true) : setLoading(true);

      const res = await API.get(`/members/${activeWedding.id}`);
      setMembers(res?.data?.data || []);
    } catch (err: any) {
      showError(err?.response?.data?.message || 'Failed to load members');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMembers();
    }, [activeWedding?.id]),
  );

  const onRefresh = () => fetchMembers(true);

  // ➕ Add Member
  const handleAddMember = () => {
    if (!activeWedding?.id) {
      showError('Please select a wedding first');
      return;
    }

    navigation.navigate('AddMember', {
      weddingId: activeWedding.id,
    });
  };

  // ❌ Remove Member
  const handleRemove = (userId: number) => {
    setSelectedUserId(userId);
    setConfirmVisible(true);
  };

  const confirmDelete = async () => {
    try {
      if (!selectedUserId) return;

      setRemoving(true);

      await API.post('/members/remove', {
        weddingId: activeWedding.id,
        userId: selectedUserId,
      });

      showSuccess('Member removed');

      setConfirmVisible(false);
      setSelectedUserId(null);

      fetchMembers();
    } catch (err: any) {
      showError(err?.response?.data?.message || 'Failed to remove member');
    } finally {
      setRemoving(false);
    }
  };

  // 🟡 Open Role Modal
  const handleRolePress = (member: any) => {
    setSelectedMember(member);
    setRoleModalVisible(true);
  };

  // 🔁 Update Role
  const updateRole = async (role: 'admin' | 'member') => {
    try {
      if (!selectedMember) return;

      setUpdatingRole(true);

      await API.post('/members/update-role', {
        weddingId: activeWedding.id,
        userId: selectedMember.userId,
        role,
      });

      showSuccess('Role updated');

      setRoleModalVisible(false);
      setSelectedMember(null);

      fetchMembers();
    } catch (err: any) {
      showError(err?.response?.data?.message || 'Failed to update role');
    } finally {
      setUpdatingRole(false);
    }
  };

  // 🔹 Loading
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6D2E46" />
      </View>
    );
  }

  // 🔹 No Wedding
  if (!activeWedding) {
    return (
      <View style={styles.center}>
        <Text>Please select a wedding from Home</Text>
      </View>
    );
  }

  // 🔹 Empty
  if (members.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No members yet</Text>

        <TouchableOpacity style={styles.primaryBtn} onPress={handleAddMember}>
          <Text style={styles.primaryBtnText}>+ Add Member</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Members ({activeWedding?.title})
      </Text>

      <FlatList
        data={members}
        keyExtractor={(item) => `member-${item.id}`}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => {
          const renderRightActions = () => (
            <TouchableOpacity
              style={styles.deleteBox}
              onPress={() => handleRemove(item.userId)}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          );

          return (
            <Swipeable renderRightActions={renderRightActions}>
              <View style={styles.card}>
                <View>
                  <Text style={styles.name}>
                    {item.User?.name || 'No Name'}
                  </Text>
                  <Text style={styles.email}>
                    {item.User?.email || ''}
                  </Text>
                </View>

                {/* 🔥 CLICKABLE ROLE */}
                <TouchableOpacity
                  onPress={() => handleRolePress(item)}
                  style={[
                    styles.roleBadge,
                    item.role === 'admin'
                      ? styles.adminBadge
                      : styles.memberBadge,
                  ]}
                >
                  <Text style={styles.roleText}>{item.role}</Text>
                </TouchableOpacity>
              </View>
            </Swipeable>
          );
        }}
      />

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={handleAddMember}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>

      {/* DELETE MODAL */}
      <ConfirmModal
        visible={confirmVisible}
        title="Remove Member"
        message="Are you sure you want to remove this member?"
        confirmText="Remove"
        onConfirm={confirmDelete}
        onCancel={() => {
          setConfirmVisible(false);
          setSelectedUserId(null);
        }}
        loading={removing}
      />

      {/* ROLE MODAL */}
      <ConfirmModal
        visible={roleModalVisible}
        title="Update Role"
        message="Choose new role"
        confirmText="Make Admin"
        cancelText="Make Member"
        onConfirm={() => updateRole('admin')}
        onCancel={() => updateRole('member')}
        loading={updatingRole}
      />
    </View>
  );
}

// 🎨 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6F2',
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
  },
  email: {
    fontSize: 12,
    color: '#777',
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  adminBadge: {
    backgroundColor: '#6D2E46',
  },
  memberBadge: {
    backgroundColor: '#999',
  },
  roleText: {
    color: '#fff',
    fontSize: 11,
  },
  deleteBox: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 14,
    marginBottom: 10,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#6D2E46',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabText: {
    color: '#fff',
    fontSize: 28,
  },
  primaryBtn: {
    marginTop: 20,
    backgroundColor: '#6D2E46',
    padding: 12,
    borderRadius: 10,
  },
  primaryBtnText: {
    color: '#fff',
  },
});