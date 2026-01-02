import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Leaf, Eye, EyeOff, ChevronDown, ChevronUp, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  role: 'admin' | 'user';
}

const AdminPanel = ({ onClose }: { onClose: () => void }) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUsers, setShowUsers] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Fetch profiles with their roles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      const usersWithRoles = profiles?.map(profile => {
        const userRole = roles?.find(r => r.user_id === profile.id);
        return {
          ...profile,
          role: (userRole?.role as 'admin' | 'user') || 'user',
        };
      }) || [];

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch users.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleUserRole = async (userId: string, currentRole: 'admin' | 'user') => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ));

      toast({
        title: 'Role Updated',
        description: `User role changed to ${newRole}.`,
      });
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user role.',
        variant: 'destructive',
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-card p-6 rounded-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl nature-gradient flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <h2 className="font-display text-2xl font-bold">Admin Panel</h2>
          </div>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>

        {/* Users Section */}
        <div className="space-y-4">
          <button
            onClick={() => setShowUsers(!showUsers)}
            className="w-full flex items-center justify-between p-4 glass-card rounded-xl hover:bg-primary/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-primary" />
              <span className="font-semibold">Registered Users</span>
              <Badge variant="secondary">{users.length}</Badge>
            </div>
            {showUsers ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          {showUsers && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading users...</div>
              ) : users.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No users found</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Email</th>
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Name</th>
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Role</th>
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Joined</th>
                        <th className="text-right p-3 text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((userProfile) => (
                        <tr key={userProfile.id} className="border-b border-border/50 hover:bg-primary/5">
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{userProfile.email}</span>
                              {userProfile.id === user?.id && (
                                <Badge variant="outline" className="text-xs">You</Badge>
                              )}
                            </div>
                          </td>
                          <td className="p-3 text-sm">{userProfile.full_name || '-'}</td>
                          <td className="p-3">
                            <Badge variant={userProfile.role === 'admin' ? 'default' : 'secondary'}>
                              {userProfile.role === 'admin' ? (
                                <><Shield className="w-3 h-3 mr-1" /> Admin</>
                              ) : (
                                <><UserCheck className="w-3 h-3 mr-1" /> User</>
                              )}
                            </Badge>
                          </td>
                          <td className="p-3 text-sm text-muted-foreground">
                            {new Date(userProfile.created_at).toLocaleDateString()}
                          </td>
                          <td className="p-3 text-right">
                            {userProfile.id !== user?.id && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleUserRole(userProfile.id, userProfile.role)}
                              >
                                Make {userProfile.role === 'admin' ? 'User' : 'Admin'}
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Info */}
        <div className="mt-6 p-4 rounded-xl bg-gold/10 border border-gold/20">
          <p className="text-sm text-accent-foreground">
            <strong>Admin Privileges:</strong> Admins can add new plants, edit existing plants, 
            manage user roles, and view all registered users.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminPanel;
