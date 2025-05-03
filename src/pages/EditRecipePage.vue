<template>
  <div class="page-wrapper">
    <h2>Editar Receita</h2>
    <RecipeForm :model-value="recipe" submit-label="Salvar" @submit="handleSubmit" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/services/api';
import RecipeForm from '@/components/RecipeForm.vue';

const route = useRoute();
const router = useRouter();
const recipe = ref({
    name: '',
    preparation_time_minutes: 0,
    servings: 0,
    preparation_method: '',
    ingredients: '',
    categoryId: ''
});

onMounted(async () => {
    const { data } = await api.get(`/recipes/${route.params.id}`);
    recipe.value = {
        name: data.name,
        preparation_time_minutes: data.preparation_time_minutes,
        servings: data.servings,
        preparation_method: data.preparation_method,
        ingredients: data.ingredients,
        categoryId: data.category?.id || ''
    };
});

const handleSubmit = async (updatedData: any) => {
    await api.put(`/recipes/${route.params.id}`, updatedData);
    router.push('/receitas');
};
</script>

<style scoped>
.page-wrapper {
    padding: 2rem;
    max-width: 600px;
    margin: auto;
}
</style>