import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../contexts/ThemeContext';
import { useProjects } from '../../contexts/ProjectContext';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Project, ProjectColor } from '../../types';
import { BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, PROJECT_COLORS, PROJECT_ICONS, SPACING } from '../../styles/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  editProject?: Project;
}

export function CreateProjectModal({ visible, onClose, editProject }: Props) {
  const { colors } = useTheme();
  const { createProject, updateProject } = useProjects();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState<ProjectColor>('#7C3AED');
  const [icon, setIcon] = useState('briefcase');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!editProject;

  useEffect(() => {
    if (editProject) {
      setName(editProject.name);
      setDescription(editProject.description);
      setColor(editProject.color);
      setIcon(editProject.icon);
    } else {
      setName('');
      setDescription('');
      setColor('#7C3AED');
      setIcon('briefcase');
    }
    setError('');
  }, [editProject, visible]);

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Nome é obrigatório');
      return;
    }
    setLoading(true);
    try {
      if (isEditing && editProject) {
        await updateProject(editProject.id, { name: name.trim(), description, color, icon });
      } else {
        await createProject({ name: name.trim(), description, color, icon });
      }
      onClose();
    } catch {
      setError('Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={isEditing ? 'Editar projeto' : 'Novo projeto'}
    >
      <View style={styles.content}>
        {/* Preview */}
        <View style={[styles.preview, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
          <View style={[styles.previewIcon, { backgroundColor: color + '22' }]}>
            <Ionicons name={icon as any} size={28} color={color} />
          </View>
          <Text style={[styles.previewName, { color: name ? colors.text : colors.textMuted }]}>
            {name || 'Nome do projeto'}
          </Text>
        </View>

        <Input
          label="Nome do projeto"
          placeholder="Ex: App Mobile"
          value={name}
          onChangeText={v => { setName(v); setError(''); }}
          icon="text"
          error={error}
        />

        <Input
          label="Descrição (opcional)"
          placeholder="Descreva o projeto..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />

        {/* Color picker */}
        <Text style={[styles.pickerLabel, { color: colors.textSecondary }]}>Cor</Text>
        <View style={styles.colorRow}>
          {PROJECT_COLORS.map(c => (
            <TouchableOpacity
              key={c}
              style={[
                styles.colorDot,
                { backgroundColor: c },
                color === c && styles.colorDotSelected,
              ]}
              onPress={() => setColor(c as ProjectColor)}
            >
              {color === c && <Ionicons name="checkmark" size={14} color="#fff" />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Icon picker */}
        <Text style={[styles.pickerLabel, { color: colors.textSecondary }]}>Ícone</Text>
        <View style={styles.iconGrid}>
          {PROJECT_ICONS.map(ic => (
            <TouchableOpacity
              key={ic}
              style={[
                styles.iconBtn,
                {
                  backgroundColor:
                    icon === ic ? color + '22' : colors.inputBackground,
                  borderColor: icon === ic ? color : colors.border,
                },
              ]}
              onPress={() => setIcon(ic)}
            >
              <Ionicons
                name={ic as any}
                size={20}
                color={icon === ic ? color : colors.textMuted}
              />
            </TouchableOpacity>
          ))}
        </View>

        <Button
          title={isEditing ? 'Salvar alterações' : 'Criar projeto'}
          onPress={handleSave}
          loading={loading}
          fullWidth
          size="lg"
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 4,
    paddingBottom: SPACING.md,
  },
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    marginBottom: SPACING.sm,
  },
  previewIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewName: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    flex: 1,
  },
  pickerLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 4,
  },
  colorRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  colorDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorDotSelected: {
    borderWidth: 3,
    borderColor: '#fff',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  iconBtn: {
    width: 46,
    height: 46,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
});
